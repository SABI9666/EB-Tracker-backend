// api/projects.js - Fixed with proper hour allocation logic
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');

const db = admin.firestore();

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

// Helper function to remove undefined values from objects before Firestore
function sanitizeForFirestore(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

const handler = async (req, res) => {
    try {
        await util.promisify(verifyToken)(req, res);

        // Parse JSON body for POST/PUT
        if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] === 'application/json') {
            if (!req.body || Object.keys(req.body).length === 0) {
                await new Promise((resolve) => {
                    const chunks = [];
                    req.on('data', (chunk) => chunks.push(chunk));
                    req.on('end', () => {
                        try {
                            const bodyBuffer = Buffer.concat(chunks);
                            req.body = bodyBuffer.length > 0 ? JSON.parse(bodyBuffer.toString()) : {};
                        } catch (e) {
                            console.error("Error parsing JSON body:", e);
                            req.body = {};
                        }
                        resolve();
                    });
                });
            }
        }

        // ============================================
        // GET - Retrieve projects with role-based filtering
        // ============================================
        if (req.method === 'GET') {
            const { id } = req.query;
            
            if (id) {
                const doc = await db.collection('projects').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Project not found' });
                }
                
                const projectData = { id: doc.id, ...doc.data() };
                
                // Check access based on role and allocation
                if (req.user.role === 'design_lead' && projectData.designLeadUid !== req.user.uid) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'You are not allocated to this project' 
                    });
                }
                
                if (req.user.role === 'designer' && !projectData.assignedDesigners?.includes(req.user.uid)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'You are not assigned to this project' 
                    });
                }
                
                // Load tasks for this project
                const tasksSnapshot = await db.collection('tasks')
                    .where('projectId', '==', id)
                    .get();
                projectData.tasks = tasksSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                
                // Load deliverables for this project
                const deliverablesSnapshot = await db.collection('deliverables')
                    .where('projectId', '==', id)
                    .orderBy('uploadedAt', 'desc')
                    .get();
                projectData.deliverables = deliverablesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                
                // Load BDM files if Design Lead or Designer
                if (['design_lead', 'designer'].includes(req.user.role)) {
                    const filesSnapshot = await db.collection('files')
                        .where('proposalId', '==', projectData.proposalId)
                        .get();
                    projectData.bdmFiles = filesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                }
                
                return res.status(200).json({ success: true, data: projectData });
            }
            
            // Get projects based on role
            let query = db.collection('projects').orderBy('createdAt', 'desc');
            
            // Design Leads ONLY see projects allocated to them by COO
            if (req.user.role === 'design_lead') {
                query = query.where('designLeadUid', '==', req.user.uid)
                            .where('status', 'in', ['assigned', 'in_progress', 'completed']);
            }
            
            // Designer: Only projects where they are assigned by Design Lead
            else if (req.user.role === 'designer') {
                query = query.where('assignedDesigners', 'array-contains', req.user.uid);
            }
            
            // BDM: Only their own projects
            else if (req.user.role === 'bdm') {
                query = query.where('bdmUid', '==', req.user.uid);
            }
            
            // COO, Director, Accounts: See all projects (no filter needed)
            
            const snapshot = await query.get();
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            return res.status(200).json({ success: true, data: projects });
        }

        // ============================================
        // POST - Create project from proposal
        // ============================================
        if (req.method === 'POST') {
            const { action, proposalId } = req.body;
            
            if (action === 'create_from_proposal') {
                // Only COO or Director can create projects
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can create projects' 
                    });
                }
                
                if (!proposalId) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Proposal ID is required' 
                    });
                }
                
                // Get proposal data
                const proposalDoc = await db.collection('proposals').doc(proposalId).get();
                if (!proposalDoc.exists) {
                    return res.status(404).json({ 
                        success: false, 
                        error: 'Proposal not found' 
                    });
                }
                
                const proposal = proposalDoc.data();
                
                // Check if proposal is won
                if (proposal.status !== 'won') {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Only WON proposals can be converted to projects' 
                    });
                }
                
                // Check if project already exists
                if (proposal.projectCreated && proposal.projectId) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Project already exists for this proposal',
                        projectId: proposal.projectId 
                    });
                }
                
                // Create the project
                const projectData = {
                    proposalId: proposalId,
                    projectName: proposal.projectName,
                    projectCode: proposal.pricing?.projectNumber || 'PENDING',
                    clientCompany: proposal.clientCompany,
                    clientContact: proposal.clientContact || '',
                    clientEmail: proposal.clientEmail || '',
                    clientPhone: proposal.clientPhone || '',
                    location: proposal.location || '',
                    bdmName: proposal.createdByName || 'Unknown',
                    bdmUid: proposal.createdByUid || '',
                    bdmEmail: proposal.createdByEmail || proposal.bdmEmail || '',
                    quoteValue: proposal.pricing?.quoteValue || 0,
                    currency: proposal.pricing?.currency || 'USD',
                    status: 'pending', // Will be 'assigned' when allocated to design lead
                    designStatus: 'not_started',
                    
                    // Initialize all hour fields
                    maxAllocatedHours: 0,
                    additionalHours: 0,
                    totalAllocatedHours: 0,
                    hoursLogged: 0,
                    
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdByName: req.user.name,
                    createdByUid: req.user.uid,
                    createdByRole: req.user.role
                };
                
                // Sanitize to remove any undefined values
                const sanitizedProjectData = sanitizeForFirestore(projectData);
                
                const projectRef = await db.collection('projects').add(sanitizedProjectData);
                
                // Update proposal with project reference
                await db.collection('proposals').doc(proposalId).update({
                    projectCreated: true,
                    projectId: projectRef.id,
                    projectCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                
                // Log activity
                await db.collection('activities').add({
                    type: 'project_created',
                    details: `Project created from proposal: ${proposal.projectName}`,
                    performedByName: req.user.name,
                    performedByRole: req.user.role,
                    performedByUid: req.user.uid,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    projectId: projectRef.id,
                    proposalId: proposalId
                });
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'Project created successfully',
                    projectId: projectRef.id 
                });
            }
            
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid action' 
            });
        }

        // ============================================
        // PUT - Update project (COO allocation and Design Lead assignment)
        // ============================================
        if (req.method === 'PUT') {
            const { id } = req.query;
            const { action, data } = req.body;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Missing project ID' });
            }
            
            const projectRef = db.collection('projects').doc(id);
            const projectDoc = await projectRef.get();
            
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
            
            const project = projectDoc.data();
            let updates = {};
            let activityDetail = '';
            let notifications = [];
            
            // FIXED: Changed from 'allocate_design_lead' to 'allocate_to_design_lead' to match frontend
            if (action === 'allocate_to_design_lead' || action === 'allocate_design_lead') {
                // Only COO or Director can allocate
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can allocate projects to Design Leads' 
                    });
                }
                
                // Validate the Design Lead UID from database
                const designLeadUid = data.designLeadUid;
                if (!designLeadUid) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Design Lead UID is required' 
                    });
                }
                
                // Validate allocation notes - REQUIRED field
                if (!data.allocationNotes || data.allocationNotes.trim() === '') {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Allocation notes are required' 
                    });
                }
                
                // Fetch actual user from database to validate
                const designLeadDoc = await db.collection('users').doc(designLeadUid).get();
                if (!designLeadDoc.exists) {
                    return res.status(404).json({ 
                        success: false, 
                        error: 'Design Lead user not found' 
                    });
                }
                
                const designLeadData = designLeadDoc.data();
                if (designLeadData.role !== 'design_lead') {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Selected user is not a Design Lead' 
                    });
                }
                
                // ================== FIX 1: Save Hours from COO ==================
                const maxAllocatedHours = parseFloat(data.maxAllocatedHours || 0);
                if (maxAllocatedHours <= 0) {
                     return res.status(400).json({ 
                        success: false, 
                        error: 'Max Allocated Hours must be greater than 0' 
                    });
                }
                
                // Update project with actual Design Lead info
                updates = {
                    designLeadName: designLeadData.name,
                    designLeadUid: designLeadUid,
                    designLeadEmail: designLeadData.email,
                    allocationDate: admin.firestore.FieldValue.serverTimestamp(),
                    allocatedBy: req.user.name,
                    allocatedByUid: req.user.uid,
                    projectStartDate: data.projectStartDate || admin.firestore.FieldValue.serverTimestamp(),
                    targetCompletionDate: data.targetCompletionDate || null,
                    allocationNotes: data.allocationNotes || '',
                    specialInstructions: data.specialInstructions || '',
                    priority: data.priority || 'Normal',
                    status: 'assigned',
                    designStatus: 'allocated',
                    
                    // === ADDED THESE FIELDS ===
                    maxAllocatedHours: maxAllocatedHours,
                    additionalHours: parseFloat(data.additionalHours || 0)
                    // ==========================
                };
                
                activityDetail = `Project allocated to Design Lead: ${designLeadData.name} by ${req.user.name} with ${maxAllocatedHours} hours.`;
                
                // Notify the Design Lead
                notifications.push({
                    type: 'project_allocated',
                    recipientUid: designLeadUid,
                    recipientRole: 'design_lead',
                    message: `New project allocated: "${project.projectName}" (${maxAllocatedHours} hours)`,
                    projectId: id,
                    projectName: project.projectName,
                    clientCompany: project.clientCompany,
                    allocatedBy: req.user.name,
                    priority: 'high'
                });
                
                // Notify BDM about allocation
                if (project.bdmUid) {
                    notifications.push({
                        type: 'project_allocated',
                        recipientUid: project.bdmUid,
                        recipientRole: 'bdm',
                        message: `Project "${project.projectName}" has been allocated to ${designLeadData.name}`,
                        projectId: id,
                        priority: 'normal'
                    });
                }
                
            } 
            
            // Design Lead assigning designers
            else if (action === 'assign_designers') {
                // Only Design Lead (who is allocated) or COO/Director can assign designers
                if (req.user.role === 'design_lead' && project.designLeadUid !== req.user.uid) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'You are not the allocated Design Lead for this project' 
                    });
                }
                
                if (!['design_lead', 'coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only Design Lead, COO, or Director can assign designers' 
                    });
                }
                
                // ================== FIX 2: Get correct hour data ==================
                const designerUids = data.designerUids || [];
                const designerHoursMap = data.designerHours || {}; // e.g., { "uid1": 8, "uid2": 10 }
                const totalAllocatedHours = data.totalAllocatedHours || 0; // Total
                // ===================================================================
                
                const validatedDesigners = [];
                
                // Validation for allocated hours
                const maxHours = (project.maxAllocatedHours || 0) + (project.additionalHours || 0);
                if (maxHours > 0 && totalAllocatedHours > maxHours) {
                    return res.status(400).json({
                        success: false,
                        error: `Total allocated hours (${totalAllocatedHours}) exceeds available budget (${maxHours})`
                    });
                }
                
                // Validate all designers from database
                for (const uid of designerUids) {
                    const userDoc = await db.collection('users').doc(uid).get();
                    if (!userDoc.exists) {
                        return res.status(400).json({
                            success: false,
                            error: `User ${uid} not found`
                        });
                    }
                    const userData = userDoc.data();
                    if (userData.role !== 'designer') {
                        return res.status(400).json({
                            success: false,
                            error: `User ${userData.name} is not a designer`
                        });
                    }
                    validatedDesigners.push({
                        uid: uid,
                        name: userData.name,
                        email: userData.email
                    });
                }
                
                updates = {
                    assignedDesigners: validatedDesigners.map(d => d.uid),
                    assignedDesignerNames: validatedDesigners.map(d => d.name),
                    assignedDesignerEmails: validatedDesigners.map(d => d.email),
                    assignmentDate: admin.firestore.FieldValue.serverTimestamp(),
                    assignedBy: req.user.name,
                    assignedByUid: req.user.uid,
                    
                    // === UPDATED THESE FIELDS ===
                    assignedDesignerHours: designerHoursMap, // Store the map
                    totalAllocatedHours: totalAllocatedHours, // Store the calculated total
                    hoursLogged: 0, // Reset or initialize hours logged when re-assigning
                    // ============================
                    
                    status: 'in_progress',
                    designStatus: 'in_progress'
                };
                
                activityDetail = `Designers assigned: ${validatedDesigners.map(d => d.name).join(', ')} with a total of ${totalAllocatedHours} hours.`;
                
                // Notify each designer
                for (const designer of validatedDesigners) {
                    notifications.push({
                        type: 'project_assigned',
                        recipientUid: designer.uid,
                        recipientRole: 'designer',
                        message: `New project assigned: "${project.projectName}" (${designerHoursMap[designer.uid] || 0} hours allocated)`,
                        projectId: id,
                        projectName: project.projectName,
                        clientCompany: project.clientCompany,
                        assignedBy: req.user.name,
                        allocatedHours: designerHoursMap[designer.uid] || 0,
                        priority: 'high'
                    });
                }
            }
            
            else {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid action' 
                });
            }
            
            // Apply updates
            updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            await projectRef.update(updates);
            
            // Log activity
            await db.collection('activities').add({
                type: `project_${action}`,
                details: activityDetail,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: id,
                projectName: project.projectName
            });
            
            // Send all notifications
            for (const notification of notifications) {
                await db.collection('notifications').add({
                    ...notification,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false
                });
            }
            
            return res.status(200).json({ 
                success: true, 
                message: 'Project updated successfully' 
            });
        }

        // ============================================
        // DELETE - Delete project (COO/Director only)
        // ============================================
        if (req.method === 'DELETE') {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Missing project ID' });
            }
            
            // Only COO or Director can delete projects
            if (!['coo', 'director'].includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Only COO or Director can delete projects' 
                });
            }
            
            const projectRef = db.collection('projects').doc(id);
            const projectDoc = await projectRef.get();
            
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
            
            const project = projectDoc.data();
            
            // Delete the project
            await projectRef.delete();
            
            // If there's a linked proposal, update it
            if (project.proposalId) {
                await db.collection('proposals').doc(project.proposalId).update({
                    projectCreated: false,
                    projectId: null,
                    allocationStatus: null,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
            
            // Log activity
            await db.collection('activities').add({
                type: 'project_deleted',
                details: `Project deleted: ${project.projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: id
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Project deleted successfully' 
            });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });
        
    } catch (error) {
        console.error('Projects API error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

module.exports = allowCors(handler);
2. New File: api/variations.js
You must create this new file in your api/ folder. This will fix the POST /api/variations 404 error.

JavaScript

// api/variations.js - Handles creation of new variations
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');

const db = admin.firestore();

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

// Helper function to remove undefined values from objects before Firestore
function sanitizeForFirestore(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

const handler = async (req, res) => {
    try {
        await util.promisify(verifyToken)(req, res);

        // Parse JSON body for POST/PUT
        if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] === 'application/json') {
            if (!req.body || Object.keys(req.body).length === 0) {
                await new Promise((resolve) => {
                    const chunks = [];
                    req.on('data', (chunk) => chunks.push(chunk));
                    req.on('end', () => {
                        try {
                            const bodyBuffer = Buffer.concat(chunks);
                            req.body = bodyBuffer.length > 0 ? JSON.parse(bodyBuffer.toString()) : {};
                        } catch (e) {
                            console.error("Error parsing JSON body:", e);
                            req.body = {};
                        }
                        resolve();
                    });
                });
            }
        }

        // ============================================
        // POST - Create a new variation for approval
        // ============================================
        if (req.method === 'POST') {
            // Only Design Leads can create variations
            if (req.user.role !== 'design_lead') {
                return res.status(403).json({ success: false, error: 'Only Design Leads can submit variations.' });
            }

            const {
                parentProjectId,
                variationCode,
                estimatedHours,
                scopeDescription
            } = req.body;

            // --- Validation ---
            if (!parentProjectId || !variationCode || !estimatedHours || !scopeDescription) {
                return res.status(400).json({ success: false, error: 'Missing required fields.' });
            }

            // Get parent project for context
            const projectDoc = await db.collection('projects').doc(parentProjectId).get();
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Parent project not found.' });
            }
            const project = projectDoc.data();

            // Check for duplicate variation code
            const existingVariation = await db.collection('variations')
                .where('parentProjectId', '==', parentProjectId)
                .where('variationCode', '==', variationCode)
                .get();

            if (!existingVariation.empty) {
                return res.status(400).json({ success: false, error: 'This Variation Code already exists for this project.' });
            }

            // --- Create Variation Document ---
            const variationData = {
                parentProjectId: parentProjectId,
                parentProjectName: project.projectName,
                parentProjectCode: project.projectCode,
                clientCompany: project.clientCompany,
                
                variationCode: variationCode,
                estimatedHours: parseFloat(estimatedHours),
                scopeDescription: scopeDescription,
                
                status: 'pending_coo_approval',
                
                createdByUid: req.user.uid,
                createdByName: req.user.name,
                createdByRole: req.user.role,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const variationRef = await db.collection('variations').add(sanitizeForFirestore(variationData));

            // --- Log Activity ---
            await db.collection('activities').add({
                type: 'variation_created',
                details: `Variation "${variationCode}" (${estimatedHours}h) submitted for approval by ${req.user.name}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: parentProjectId,
                variationId: variationRef.id
            });

            // --- Notify all COOs ---
            const cooSnapshot = await db.collection('users').where('role', '==', 'coo').get();
            const notifications = [];
            
            cooSnapshot.forEach(doc => {
                notifications.push(db.collection('notifications').add({
                    type: 'variation_pending_approval',
                    recipientUid: doc.id,
                    recipientRole: 'coo',
                    message: `New variation "${variationCode}" for ${project.projectName} requires approval.`,
                    projectId: parentProjectId,
                    variationId: variationRef.id,
                    estimatedHours: parseFloat(estimatedHours),
                    submittedBy: req.user.name,
                    priority: 'high',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false
                }));
            });
            
            await Promise.all(notifications);

            return res.status(200).json({ success: true, message: 'Variation submitted for approval.', variationId: variationRef.id });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });

    } catch (error) {
        console.error('Variations API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

module.exports = allowCors(handler);
3. New File: api/projects/generate-variation-code.js
You must create this new file inside a new folder named projects within your api/ folder. The path should be api/projects/generate-variation-code.js. This will fix the GET /api/projects/generate-variation-code 404 error.

JavaScript

// api/projects/generate-variation-code.js - Generates the next variation code
const admin = require('../_firebase-admin'); // Note: '../' to go up one directory
const { verifyToken } = require('../../middleware/auth'); // Note: '../../'
const util = require('util');

const db = admin.firestore();

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

const handler = async (req, res) => {
    try {
        await util.promisify(verifyToken)(req, res);

        // ============================================
        // GET - Generate a new variation code
        // ============================================
        if (req.method === 'GET') {
            const { parentId } = req.query;

            if (!parentId) {
                return res.status(400).json({ success: false, error: 'Parent Project ID (parentId) is required.' });
            }

            // 1. Get parent project
            const projectDoc = await db.collection('projects').doc(parentId).get();
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Parent project not found.' });
            }
            const project = projectDoc.data();
            const baseProjectCode = project.projectCode;

            // 2. Query all existing variations for this parent
            const variationsSnapshot = await db.collection('variations')
                .where('parentProjectId', '==', parentId)
                .get();

            let maxNum = 0;
            const variationRegex = /-V(\d+)$/; // Regex to find "-V" followed by digits at the end

            variationsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.variationCode) {
                    const match = data.variationCode.match(variationRegex);
                    if (match && match[1]) {
                        const num = parseInt(match[1], 10);
                        if (num > maxNum) {
                            maxNum = num;
                        }
                    }
                }
            });

            // 3. The new variation number is the max found + 1
            const newVariationNum = maxNum + 1;
            const newVariationCode = `${baseProjectCode}-V${newVariationNum}`;

            return res.status(200).json({ success: true, data: { variationCode: newVariationCode } });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });

    } catch (error) {
        console.error('Generate Variation Code API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

module.exports = allowCors(handler);
