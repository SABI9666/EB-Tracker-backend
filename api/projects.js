// api/projects.js - MERGED VERSION
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

// Helper function to generate project code (for actual projects)
async function generateProjectCode(clientCompany) {
    const year = new Date().getFullYear().toString().slice(-2);
    const clientPrefix = (clientCompany || 'GEN').substring(0, 3).toUpperCase();
    
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.where('projectCode', '>=', `${clientPrefix}${year}-`)
                                     .where('projectCode', '<', `${clientPrefix}${year}-~`)
                                     .count()
                                     .get();

    const count = snapshot.data().count;
    const sequence = (count + 1).toString().padStart(3, '0');

    return `${clientPrefix}${year}-${sequence}`;
}

// Helper function to generate project number (for proposals/pricing)
async function generateProjectNumber(clientCompany) {
    const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
    const clientPrefix = (clientCompany || 'GEN').substring(0, 3).toUpperCase();
        
    // Get the count of all proposals with this prefix this year
    const proposalsRef = db.collection('proposals');
    const snapshot = await proposalsRef
        .where('pricing.projectNumber', '>=', `${clientPrefix}${year}-`)
        .where('pricing.projectNumber', '<', `${clientPrefix}${year}-~`)
        .count()
        .get();
        
    const count = snapshot.data().count;
    const sequence = (count + 1).toString().padStart(3, '0'); // e.g., 001, 002, 003
        
    return `${clientPrefix}${year}-${sequence}`;
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
        // GET - Retrieve projects
        // ============================================
        if (req.method === 'GET') {
            const { id } = req.query;

            if (id) {
                const doc = await db.collection('projects').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Project not found' });
                }
                const projectData = { id: doc.id, ...doc.data() };

                // Access checks (Design Lead, Designer)
                if (req.user.role === 'design_lead' && projectData.designLeadUid !== req.user.uid) {
                    return res.status(403).json({ success: false, error: 'You are not allocated to this project' });
                }
                if (req.user.role === 'designer' && !(projectData.assignedDesignerUids || []).includes(req.user.uid)) {
                     return res.status(403).json({ success: false, error: 'You are not assigned to this project' });
                }

                // Load related data
                const tasksSnapshot = await db.collection('tasks')
                    .where('projectId', '==', id)
                    .get();
                projectData.tasks = tasksSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                const deliverablesSnapshot = await db.collection('deliverables')
                    .where('projectId', '==', id)
                    .orderBy('uploadedAt', 'desc')
                    .get();
                projectData.deliverables = deliverablesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

                // Load BDM files if Design Lead or Designer
                if (['design_lead', 'designer'].includes(req.user.role) && projectData.proposalId) {
                    const filesSnapshot = await db.collection('files')
                        .where('proposalId', '==', projectData.proposalId)
                        .get();
                    projectData.bdmFiles = filesSnapshot.docs
                        .map(d => ({ id: d.id, ...d.data() }))
                        .filter(f => f.fileType === 'project' || !f.fileType);
                }

                return res.status(200).json({ success: true, data: projectData });
            }

            // Get projects list based on role
            let query = db.collection('projects').orderBy('createdAt', 'desc');

            // FIXED: Design Lead/Manager should only see projects allocated to them
            if (req.user.role === 'design_lead') {
                query = query.where('designLeadUid', '==', req.user.uid);
            } else if (req.user.role === 'designer') {
                query = query.where('assignedDesignerUids', 'array-contains', req.user.uid);
            } else if (req.user.role === 'bdm') {
                 query = query.where('bdmUid', '==', req.user.uid);
            }
            // COO, Director, Accounts see all projects

            const snapshot = await query.get();
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json({ success: true, data: projects });
        }

        // ============================================
        // POST - Create Project from Proposal OR Generate Project Number
        // ============================================
        if (req.method === 'POST') {
            // Read action from both query parameter and request body
            const action = req.query.action || req.body?.action;
            
            // --- MODIFIED BLOCK ---
            if (action === 'create_from_proposal') {
                const { proposalId, designLeadUid, allocationComments } = req.body;
                if (!proposalId) {
                    return res.status(400).json({ success: false, error: 'Missing proposal ID' });
                }
                    
                if (!designLeadUid) {
                    return res.status(400).json({ success: false, error: 'Design Manager/Lead must be selected' });
                }
                // Only COO or Director can create/allocate projects
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can allocate projects' 
                    });
                }
                const proposalRef = db.collection('proposals').doc(proposalId);
                const proposalDoc = await proposalRef.get();
                if (!proposalDoc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }
                const proposalData = proposalDoc.data();
                if (proposalData.status !== 'won') {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Proposal must be marked as WON before creating a project' 
                    });
                }
                    
                if (proposalData.projectCreated) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Project has already been created for this proposal' 
                    });
                }
                    
                // Validate Design Lead
                const designLeadDoc = await db.collection('users').doc(designLeadUid).get();
                if (!designLeadDoc.exists || designLeadDoc.data().role !== 'design_lead') {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Invalid Design Manager/Lead selected' 
                    });
                }
                    
                const designLeadData = designLeadDoc.data();
                // Generate project code
                const projectCode = await generateProjectCode(proposalData.clientCompany);
                    
                // Get project number from pricing (set by COO)
                const projectNumber = proposalData.pricing?.projectNumber || 'Not Set';
                // Create project document
                const projectData = {
                    proposalId: proposalId,
                    projectCode: projectCode,
                    projectNumber: projectNumber,  // NEW: Include project number
                    projectName: proposalData.projectName,
                    clientCompany: proposalData.clientCompany,
                    clientName: proposalData.clientName,
                    clientEmail: proposalData.clientEmail,
                    clientPhone: proposalData.clientPhone,
                    projectLocation: proposalData.projectLocation || '',
                    projectType: proposalData.projectType || 'General',
                    scopeOfWork: proposalData.scopeOfWork || '',
                    estimatedValue: proposalData.pricing?.quoteValue || 0,
                            
                    // BDM info
                    bdmUid: proposalData.createdByUid,
                    bdmName: proposalData.createdByName,
                    bdmEmail: proposalData.createdByEmail,
                            
                    // Design Lead allocation
                    designLeadUid: designLeadUid,
                    designLeadName: designLeadData.name,
                    designLeadEmail: designLeadData.email,
                    allocationComments: allocationComments || '',  // NEW: Allocation comments
                    allocatedBy: req.user.name,                    // NEW: Who allocated
                    allocatedByUid: req.user.uid,                  // NEW: Allocator UID
                    allocatedAt: admin.firestore.FieldValue.serverTimestamp(),  // NEW: When allocated
                            
                    // Status fields
                    projectStatus: 'active',
                    designStatus: 'pending_assignment',
                    financialStatus: 'pending',
                            
                    // Timestamps
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                            
                    // Arrays
                    assignedDesignerUids: [],
                    assignedDesignerNames: [],
                    assignedDesignerEmails: [],
                    milestones: [],
                    changeLog: []
                };
                const projectRef = await db.collection('projects').add(projectData);
                // Update proposal with allocation status
                await proposalRef.update({
                    projectCreated: true,
                    projectId: projectRef.id,
                    projectCode: projectCode,
                    allocationStatus: 'allocated',  // NEW: Update allocation status
                    allocationApprovedBy: req.user.name,  // NEW: Who approved allocation
                    allocationApprovedAt: admin.firestore.FieldValue.serverTimestamp(),  // NEW: When
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                // Log activity
                await db.collection('activities').add({
                    type: 'project_created_and_allocated',
                    details: `Project ${projectCode} created and allocated to ${designLeadData.name} by ${req.user.name}`,
                    performedByName: req.user.name,
                    performedByRole: req.user.role,
                    performedByUid: req.user.uid,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    projectId: projectRef.id,
                    proposalId: proposalId,
                    projectName: proposalData.projectName
                });
                // Notify Design Lead
                await db.collection('notifications').add({
                    type: 'project_allocated',
                    recipientUid: designLeadUid,
                    recipientRole: 'design_lead',
                    projectId: projectRef.id,
                    proposalId: proposalId,
                    message: `You have been allocated to project "${proposalData.projectName}" (${projectCode}) by ${req.user.name}`,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false,
                    priority: 'high'
                });
                    
                // Notify BDM
                await db.collection('notifications').add({
                    type: 'project_allocated_to_design',
                    recipientUid: proposalData.createdByUid,
                    recipientRole: 'bdm',
                    projectId: projectRef.id,
                    message: `Your project "${proposalData.projectName}" has been allocated to ${designLeadData.name}`,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false
                });
                return res.status(201).json({
                    success: true,
                    message: `Project created successfully and allocated to ${designLeadData.name}`,
                    data: {
                        projectId: projectRef.id,
                        projectCode: projectCode,
                        projectNumber: projectNumber
                    }
                });
            }
            // --- END MODIFIED BLOCK ---
            // --- ADDED ACTION ---
            else if (action === 'generate_project_number') {
                // Only COO or Director can generate project numbers
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can generate project numbers' 
                    });
                }
    
                const { clientCompany } = req.body;
    
                if (!clientCompany) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Client company name is required' 
                    });
                }
    
                // Call the new helper function
                const projectNumber = await generateProjectNumber(clientCompany);
    
                return res.status(200).json({
                    success: true,
                    data: {
                        projectNumber: projectNumber,
                        generatedAt: new Date().toISOString(),
                        generatedBy: req.user.name
                    }
                });
            }
            // --- END ADDED ACTION ---

            return res.status(400).json({ success: false, error: 'Invalid action for POST request' });
        }

        // ============================================
        // PUT - Update project
        // ============================================
        if (req.method === 'PUT') {
            const { id } = req.query;
            const { action, data } = req.body;

            if (!id || !action) {
                return res.status(400).json({ success: false, error: 'Missing project ID or action' });
            }

            const projectRef = db.collection('projects').doc(id);
            const projectDoc = await projectRef.get();

            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }

            const project = projectDoc.data();
            let updates = {};
            let activityDetail = '';
            const notifications = [];

            // Action: Allocate to Design Lead/Manager
            if (action === 'allocate_design_lead') {
                // FIXED: Only COO or Director can allocate
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ success: false, error: 'Only COO or Director can allocate projects to Design Managers' });
                }

                if (!data.designLeadUid) {
                    return res.status(400).json({ success: false, error: 'Missing designLeadUid in data' });
                }

                // FIXED: Validate the user is actually a design_lead
                const designLeadDoc = await db.collection('users').doc(data.designLeadUid).get();
                if (!designLeadDoc.exists) {
                    return res.status(404).json({ success: false, error: 'Design Manager not found' });
                }

                const designLeadData = designLeadDoc.data();
                if (designLeadData.role !== 'design_lead') {
                    return res.status(400).json({ success: false, error: 'Selected user is not a Design Manager/Lead' });
                }

                updates = {
                    designLeadUid: data.designLeadUid,
                    designLeadName: designLeadData.name,
                    designLeadEmail: designLeadData.email,
                    allocationDate: admin.firestore.FieldValue.serverTimestamp(),
                    targetCompletionDate: data.targetCompletionDate || null,
                    allocationNotes: data.allocationNotes || '',
                    allocatedBy: req.user.name,
                    allocatedByUid: req.user.uid,
                    status: 'in_progress',
                    designStatus: 'pending_assignment'
                };

                activityDetail = `Project allocated to Design Manager: ${designLeadData.name}`;

                // Notify Design Lead
                notifications.push({
                    type: 'project_allocated',
                    recipientUid: data.designLeadUid,
                    recipientRole: 'design_lead',
                    message: `New project allocated to you: "${project.projectName}"`,
                    projectId: id,
                    projectName: project.projectName,
                    allocatedBy: req.user.name,
                    priority: 'high'
                });

                // Notify BDM
                if (project.bdmUid) {
                    notifications.push({
                        type: 'project_allocated_update',
                        recipientUid: project.bdmUid,
                        recipientRole: 'bdm',
                        message: `Your project "${project.projectName}" has been allocated to ${designLeadData.name}`,
                        projectId: id,
                        priority: 'normal'
                    });
                }
            }
            // Action: Assign Designers
            else if (action === 'assign_designers') {
                // FIXED: Only Design Lead, COO, or Director can assign designers
                if (!['design_lead', 'coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ success: false, error: 'Only Design Manager, COO, or Director can assign designers' });
                }

                // Design Lead can only assign to their own projects
                if (req.user.role === 'design_lead' && project.designLeadUid !== req.user.uid) {
                    return res.status(4H03).json({ success: false, error: 'You can only assign designers to your own projects' });
                }

                if (!data.designerUids || !Array.isArray(data.designerUids)) {
                    return res.status(400).json({ success: false, error: 'Missing or invalid designerUids array' });
                }

                const designerUids = data.designerUids.filter(uid => uid);
                const validatedDesigners = [];

                for (const uid of designerUids) {
                    const userDoc = await db.collection('users').doc(uid).get();
                    if (userDoc.exists && userDoc.data().role === 'designer') {
                        validatedDesigners.push({ 
                            uid: uid, 
                            name: userDoc.data().name, 
                            email: userDoc.data().email 
                        });
                    } else {
                        console.warn(`Invalid or non-designer user skipped: ${uid}`);
                    }
                }

                updates = {
                    assignedDesignerUids: validatedDesigners.map(d => d.uid),
                    assignedDesignerNames: validatedDesigners.map(d => d.name),
                    assignedDesignerEmails: validatedDesigners.map(d => d.email),
                    assignmentDate: admin.firestore.FieldValue.serverTimestamp(),
                    assignedBy: req.user.name,
                    assignedByUid: req.user.uid,
                    designStatus: validatedDesigners.length > 0 ? 'in_progress' : 'pending_assignment'
                };

                activityDetail = `Designers assigned: ${validatedDesigners.map(d => d.name).join(', ') || 'None'}`;

                // Notify assigned designers
                validatedDesigners.forEach(designer => {
                    notifications.push({
                        type: 'project_assigned',
                        recipientUid: designer.uid,
                        recipientRole: 'designer',
                        message: `You have been assigned to project: "${project.projectName}"`,
                        projectId: id,
                        projectName: project.projectName,
                        assignedBy: req.user.name,
                        priority: 'high'
                    });
                });
            }
            // Action: Update Design Status
            else if (action === 'update_design_status') {
                if (!['design_lead', 'coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ success: false, error: 'Unauthorized to update design status' });
                }

                if (!data.designStatus) {
                    return res.status(400).json({ success: false, error: 'Missing designStatus in data' });
                }

                updates = {
                    designStatus: data.designStatus,
                    ...(data.remarks && { statusRemarks: data.remarks })
                };

                activityDetail = `Design status updated to ${data.designStatus} by ${req.user.name}`;

                // Notify relevant parties
                if (data.designStatus === 'submitted') {
                    notifications.push({
                        type: 'design_submitted_for_billing',
                        recipientRole: 'accounts',
                        message: `Design submitted for project "${project.projectName}". Ready for invoicing.`,
                        projectId: id,
                        projectName: project.projectName,
                        priority: 'high'
                    });

                    if (project.bdmUid) {
                        notifications.push({
                            type: 'design_submitted_update',
                            recipientUid: project.bdmUid,
                            recipientRole: 'bdm',
                            message: `Design for project "${project.projectName}" has been submitted to the client.`,
                            projectId: id,
                            priority: 'normal'
                        });
                    }
                }
            }
            else {
                return res.status(400).json({ success: false, error: 'Invalid action for PUT request' });
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

            return res.status(200).json({ success: true, message: 'Project updated successfully' });
        }

        // ============================================
        // DELETE - Delete project
        // ============================================
        if (req.method === 'DELETE') {
             const { id } = req.query;
             if (!id) {
                 return res.status(400).json({ success: false, error: 'Missing project ID' });
             }

             if (!['director'].includes(req.user.role)) {
                return res.status(403).json({ success: false, error: 'Unauthorized to delete projects' });
             }

             const projectRef = db.collection('projects').doc(id);
             const projectDoc = await projectRef.get();
             if (!projectDoc.exists) {
                 return res.status(404).json({ success: false, error: 'Project not found' });
             }

             await projectRef.delete();

             await db.collection('activities').add({
                 type: 'project_deleted',
                 details: `Project deleted: ${projectDoc.data().projectName} (${projectDoc.data().projectCode})`,
                 performedByName: req.user.name,
                 performedByRole: req.user.role,
                 performedByUid: req.user.uid,
                 timestamp: admin.firestore.FieldValue.serverTimestamp(),
                 projectId: id
             });

             if(projectDoc.data().proposalId) {
                await db.collection('proposals').doc(projectDoc.data().proposalId).update({
                    projectCreated: false,
                    projectId: admin.firestore.FieldValue.delete()
                }).catch(err => console.error("Error updating proposal after project delete:", err));
             }

             return res.status(200).json({ success: true, message: 'Project deleted' });
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
