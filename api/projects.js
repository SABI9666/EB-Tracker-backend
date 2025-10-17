// api/projects.js - Enhanced with complete workflow
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
                
                return res.status(200).json({ success: true, data: projectData });
            }
            
            // Get projects based on role
            let query = db.collection('projects').orderBy('createdAt', 'desc');
            
            // Designer: Only projects where they are assigned
            if (req.user.role === 'designer') {
                query = query.where('assignedDesigners', 'array-contains', req.user.uid);
            }
            
            // Design Lead: Only projects assigned to them
            if (req.user.role === 'design_lead') {
                query = query.where('designLeadUid', '==', req.user.uid);
            }
            
            // BDM: Only their own projects
            if (req.user.role === 'bdm') {
                query = query.where('bdmUid', '==', req.user.uid);
            }
            
            // COO, Director, Accounts: See all projects
            
            const snapshot = await query.get();
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            return res.status(200).json({ success: true, data: projects });
        }

        // ============================================
        // POST - Create project or perform actions
        // ============================================
        if (req.method === 'POST') {
            const { action } = req.query;
            
            // Create project from won proposal
            if (action === 'create_from_proposal') {
                // Only COO, Director, or Design Lead can create projects
                if (!['coo', 'director', 'design_lead'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO, Director, or Design Lead can create projects' 
                    });
                }
                
                const { proposalId } = req.body;
                
                if (!proposalId) {
                    return res.status(400).json({ success: false, error: 'Missing proposalId' });
                }
                
                const proposalDoc = await db.collection('proposals').doc(proposalId).get();
                if (!proposalDoc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }
                
                const proposal = proposalDoc.data();
                
                // Check if proposal is won
                if (proposal.status !== 'won') {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Only won proposals can be converted to projects' 
                    });
                }
                
                const projectData = {
                    projectCode: `PRJ-${Date.now()}`,
                    projectName: proposal.projectName,
                    clientCompany: proposal.clientCompany,
                    clientRepresentative: proposal.submittedTo || '',
                    scopeOfWork: proposal.scopeOfWork,
                    quoteValue: proposal.pricing?.quoteValue || 0,
                    currency: proposal.pricing?.currency || 'USD',
                    projectType: proposal.projectType || 'Not specified',
                    country: proposal.country || 'Not specified',
                    timeline: proposal.timeline || 'Not specified',
                    
                    // Status tracking
                    status: 'pending_setup', // pending_setup, assigned, in_progress, completed, on_hold
                    designStatus: 'not_started', // not_started, in_progress, submitted, revision_required, approved
                    
                    // References
                    proposalId: proposalId,
                    bdmName: proposal.createdByName,
                    bdmUid: proposal.createdByUid,
                    
                    // Assignment (empty initially)
                    designLeadName: null,
                    designLeadUid: null,
                    designLeadEmail: null,
                    assignedDesigners: [], // Array of designer UIDs
                    assignedDesignerNames: [], // Array of designer names
                    
                    // Dates
                    projectStartDate: null,
                    targetCompletionDate: null,
                    actualCompletionDate: null,
                    lastSubmissionDate: null,
                    
                    // Payment tracking
                    paymentTerms: proposal.pricing?.paymentTerms || '',
                    paymentStatus: 'pending', // pending, invoice_generated, partially_paid, fully_paid
                    totalInvoiced: 0,
                    totalReceived: 0,
                    
                    // Metadata
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdBy: req.user.name,
                    createdByUid: req.user.uid,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    remarks: ''
                };
                
                const docRef = await db.collection('projects').add(projectData);
                
                // Mark proposal as having project created
                await db.collection('proposals').doc(proposalId).update({
                    projectCreated: true,
                    projectId: docRef.id,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                
                // Log activity
                await db.collection('activities').add({
                    type: 'project_created',
                    details: `Project created from won proposal: ${proposal.projectName}`,
                    performedByName: req.user.name,
                    performedByRole: req.user.role,
                    performedByUid: req.user.uid,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    projectId: docRef.id,
                    proposalId: proposalId
                });
                
                // Notify COO and Design Leads about new project
                const notificationRoles = ['coo', 'design_lead'];
                for (const role of notificationRoles) {
                    await db.collection('notifications').add({
                        type: 'project_created',
                        recipientRole: role,
                        message: `New project created: ${proposal.projectName} - Ready for allocation`,
                        projectId: docRef.id,
                        priority: 'high',
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                }
                
                return res.status(201).json({ 
                    success: true, 
                    data: { id: docRef.id, ...projectData },
                    message: 'Project created successfully'
                });
            }
            
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }

        // ============================================
        // PUT - Update project
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
            
            // Handle different actions
            if (action === 'allocate_to_design_lead') {
                // Only COO, Director, or Design Lead can allocate
                if (!['coo', 'director', 'design_lead'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Insufficient permissions to allocate projects' 
                    });
                }
                
                updates = {
                    designLeadName: data.designLeadName,
                    designLeadUid: data.designLeadUid,
                    designLeadEmail: data.designLeadEmail,
                    projectStartDate: data.projectStartDate || admin.firestore.FieldValue.serverTimestamp(),
                    targetCompletionDate: data.targetCompletionDate || null,
                    status: 'assigned',
                    remarks: data.remarks || ''
                };
                
                activityDetail = `Project allocated to Design Lead: ${data.designLeadName}`;
                
                // Notify the Design Lead
                notifications.push({
                    type: 'project_allocated',
                    recipientUid: data.designLeadUid,
                    recipientRole: 'design_lead',
                    message: `Project "${project.projectName}" has been allocated to you`,
                    projectId: id,
                    priority: 'high'
                });
                
            } else if (action === 'assign_designers') {
                // Only Design Lead, COO, or Director can assign designers
                if (!['design_lead', 'coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only Design Lead can assign designers' 
                    });
                }
                
                // Verify all assigned users are designers
                const designerUids = data.designerUids || [];
                const designerNames = data.designerNames || [];
                
                for (const uid of designerUids) {
                    const userDoc = await db.collection('users').doc(uid).get();
                    if (!userDoc.exists || userDoc.data().role !== 'designer') {
                        return res.status(400).json({
                            success: false,
                            error: `User ${uid} is not a designer`
                        });
                    }
                }
                
                updates = {
                    assignedDesigners: admin.firestore.FieldValue.arrayUnion(...designerUids),
                    assignedDesignerNames: admin.firestore.FieldValue.arrayUnion(...designerNames),
                    status: 'in_progress',
                    designStatus: 'in_progress'
                };
                
                activityDetail = `Designers assigned: ${designerNames.join(', ')}`;
                
                // Notify each designer
                for (let i = 0; i < designerUids.length; i++) {
                    notifications.push({
                        type: 'project_assigned',
                        recipientUid: designerUids[i],
                        recipientRole: 'designer',
                        message: `You have been assigned to project: ${project.projectName}`,
                        projectId: id,
                        priority: 'high'
                    });
                }
                
            } else if (action === 'update_design_status') {
                // Only Design Lead, COO, or Director can update design status
                if (!['design_lead', 'coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Insufficient permissions' 
                    });
                }
                
                updates = {
                    designStatus: data.designStatus,
                    remarks: data.remarks || project.remarks
                };
                
                if (data.designStatus === 'submitted') {
                    updates.lastSubmissionDate = admin.firestore.FieldValue.serverTimestamp();
                }
                
                activityDetail = `Design status updated to: ${data.designStatus}`;
                
                // Notify relevant stakeholders
                const stakeholderRoles = ['coo', 'director', 'accounts', 'bdm'];
                for (const role of stakeholderRoles) {
                    notifications.push({
                        type: 'design_status_updated',
                        recipientRole: role,
                        recipientUid: role === 'bdm' ? project.bdmUid : null,
                        message: `Design status for ${project.projectName}: ${data.designStatus}`,
                        projectId: id
                    });
                }
                
            } else if (action === 'mark_completed') {
                // Only Design Lead, COO, or Director can mark as completed
                if (!['design_lead', 'coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Insufficient permissions' 
                    });
                }
                
                updates = {
                    status: 'completed',
                    designStatus: 'approved',
                    actualCompletionDate: admin.firestore.FieldValue.serverTimestamp()
                };
                
                activityDetail = 'Project marked as completed';
                
                // Notify all stakeholders
                notifications.push({
                    type: 'project_completed',
                    recipientRole: 'accounts',
                    message: `Project completed: ${project.projectName} - Ready for final invoicing`,
                    projectId: id,
                    priority: 'high'
                });
                
            } else {
                // Simple update
                updates = data;
                activityDetail = 'Project updated';
            }
            
            updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            await projectRef.update(updates);
            
            // Log activity
            await db.collection('activities').add({
                type: action || 'project_updated',
                details: activityDetail,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: id
            });
            
            // Send notifications
            for (const notification of notifications) {
                await db.collection('notifications').add({
                    ...notification,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false
                });
            }
            
            return res.status(200).json({ success: true, message: 'Project updated successfully' });
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
