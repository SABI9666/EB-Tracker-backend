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

// Generate unique project code
function generateProjectCode() {
    const year = new Date().getFullYear();
    const random = Math.floor(100 + Math.random() * 900);
    return `EB-${year}-${random}`;
}

const handler = async (req, res) => {
    try {
        await util.promisify(verifyToken)(req, res);

        if (req.method === 'POST' && req.query.action === 'create_from_proposal') {
            // Create project from awarded proposal
            const { proposalId } = req.body;
            if (!proposalId) {
                return res.status(400).json({ success: false, error: 'Proposal ID required' });
            }

            // Get proposal data
            const proposalDoc = await db.collection('proposals').doc(proposalId).get();
            if (!proposalDoc.exists) {
                return res.status(404).json({ success: false, error: 'Proposal not found' });
            }

            const proposal = proposalDoc.data();
            
            // Check if project already exists for this proposal
            const existingProject = await db.collection('projects')
                .where('proposalId', '==', proposalId)
                .get();
            
            if (!existingProject.empty) {
                return res.status(400).json({ success: false, error: 'Project already exists for this proposal' });
            }

            // Create project with auto-filled data from proposal
            const projectData = {
                projectCode: generateProjectCode(),
                proposalId: proposalId,
                projectName: proposal.projectName,
                clientCompany: proposal.clientCompany,
                country: proposal.country || 'Not Specified',
                projectType: proposal.projectType || 'Not Specified',
                quoteValue: proposal.pricing?.quoteValue || 0,
                currency: proposal.pricing?.currency || 'USD',
                quoteType: proposal.estimation?.quoteType || 'Lump Sum',
                bdmName: proposal.createdByName,
                bdmUid: proposal.createdByUid,
                
                // Fields to be filled by COO/Design Lead
                poNumber: '',
                poDate: null,
                projectStartDate: null,
                targetCompletionDate: null,
                assignedDesignLead: '',
                assignedDesigners: [],
                projectDescription: proposal.scopeOfWork || '',
                paymentTerms: '',
                workConfirmationUrl: '',
                remarks: '',
                
                // Status tracking
                status: 'pending_setup', // pending_setup, active, on_hold, completed, cancelled
                designStatus: 'not_started', // not_started, in_progress, review, approved, submitted
                paymentStatus: 'pending', // pending, partially_paid, fully_paid, delayed
                
                // Metadata
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                createdBy: req.user.name,
                createdByUid: req.user.uid,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('projects').add(projectData);
            
            // Update proposal status to indicate project created
            await db.collection('proposals').doc(proposalId).update({
                projectCreated: true,
                projectId: docRef.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Create activity log
            await db.collection('activities').add({
                type: 'project_created',
                details: `Project ${projectData.projectCode} created from proposal`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: docRef.id,
                proposalId: proposalId
            });

            // Send notifications to COO and Design Lead
            const roles = ['coo', 'director'];
            for (const role of roles) {
                await db.collection('notifications').add({
                    type: 'project_created',
                    recipientRole: role,
                    message: `New project ${projectData.projectName} created from awarded proposal`,
                    projectId: docRef.id,
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

        if (req.method === 'GET') {
            const { id, status } = req.query;
            
            if (id) {
                const doc = await db.collection('projects').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Project not found' });
                }
                
                const projectData = doc.data();
                
                // Check access based on role
                if (req.user.role === 'bdm' && projectData.bdmUid !== req.user.uid) {
                    return res.status(403).json({ success: false, error: 'Access denied' });
                }
                
                // Get related tasks
                const tasksSnapshot = await db.collection('tasks')
                    .where('projectId', '==', id)
                    .orderBy('createdAt', 'desc')
                    .get();
                const tasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Get payment records
                const paymentsSnapshot = await db.collection('payments')
                    .where('projectId', '==', id)
                    .orderBy('createdAt', 'desc')
                    .get();
                const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                return res.status(200).json({ 
                    success: true, 
                    data: { 
                        id: doc.id, 
                        ...projectData,
                        tasks: tasks,
                        payments: payments
                    } 
                });
            }
            
            // Get all projects with filters
            let query = db.collection('projects').orderBy('createdAt', 'desc');
            
            // Apply status filter if provided
            if (status) {
                query = query.where('status', '==', status);
            }
            
            // BDMs only see their own projects
            if (req.user.role === 'bdm') {
                query = query.where('bdmUid', '==', req.user.uid);
            }
            
            const snapshot = await query.get();
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            return res.status(200).json({ success: true, data: projects });
        }

        if (req.method === 'PUT') {
            const { id } = req.query;
            const updateData = req.body;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Project ID required' });
            }
            
            const projectRef = db.collection('projects').doc(id);
            const projectDoc = await projectRef.get();
            
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
            
            const project = projectDoc.data();
            
            // Check permissions
            if (req.user.role === 'bdm' && project.bdmUid !== req.user.uid) {
                return res.status(403).json({ success: false, error: 'Access denied' });
            }
            
            // Only COO, Director, and Design Lead can update project details
            if (!['coo', 'director', 'design_lead'].includes(req.user.role) && req.user.role !== 'bdm') {
                return res.status(403).json({ success: false, error: 'Insufficient permissions to update project' });
            }
            
            // Update project
            updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            updateData.updatedBy = req.user.name;
            
            await projectRef.update(updateData);
            
            // Log activity
            await db.collection('activities').add({
                type: 'project_updated',
                details: `Project ${project.projectCode} updated`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: id
            });
            
            // Send notifications if status changed
            if (updateData.status && updateData.status !== project.status) {
                const notificationRecipients = ['coo', 'director'];
                if (project.assignedDesignLead) {
                    notificationRecipients.push('design_lead');
                }
                
                for (const role of notificationRecipients) {
                    await db.collection('notifications').add({
                        type: 'project_status_change',
                        recipientRole: role,
                        message: `Project ${project.projectName} status changed to ${updateData.status}`,
                        projectId: id,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                }
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
