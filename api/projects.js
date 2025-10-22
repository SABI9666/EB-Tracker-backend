// api/projects.js - Updated with Proper Allocation Workflow
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
                
                // FIX 3: Check access based on role and allocation
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
            
            // FIX 4: Strict visibility control for Design Leads
            if (req.user.role === 'design_lead') {
                // Design Leads ONLY see projects allocated to them by COO
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
            
            // FIX 2: COO allocation with actual Design Lead user from database
            if (action === 'allocate_to_design_lead') {
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
                    status: 'assigned',
                    designStatus: 'allocated'
                };
                
                activityDetail = `Project allocated to Design Lead: ${designLeadData.name} by ${req.user.name}`;
                
                // Notify the Design Lead
                notifications.push({
                    type: 'project_allocated',
                    recipientUid: designLeadUid,
                    recipientRole: 'design_lead',
                    message: `New project allocated: "${project.projectName}" for ${project.clientCompany}`,
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
                
                const designerUids = data.designerUids || [];
                const validatedDesigners = [];
                
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
                    status: 'in_progress',
                    designStatus: 'in_progress'
                };
                
                activityDetail = `Designers assigned: ${validatedDesigners.map(d => d.name).join(', ')}`;
                
                // Notify each designer
                for (const designer of validatedDesigners) {
                    notifications.push({
                        type: 'project_assigned',
                        recipientUid: designer.uid,
                        recipientRole: 'designer',
                        message: `New project assigned: "${project.projectName}"`,
                        projectId: id,
                        projectName: project.projectName,
                        clientCompany: project.clientCompany,
                        assignedBy: req.user.name,
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
























