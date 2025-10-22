// api/projects.js - Updated with POST handler for creation from proposal
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

// Helper function to generate project code
async function generateProjectCode(clientCompany) {
    const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
    const clientPrefix = (clientCompany || 'GEN').substring(0, 3).toUpperCase();
    
    // Get the count of projects for this client this year to generate sequence number
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.where('projectCode', '>=', `${clientPrefix}${year}-`)
                                     .where('projectCode', '<', `${clientPrefix}${year}-~`)
                                     .count()
                                     .get();

    const count = snapshot.data().count;
    const sequence = (count + 1).toString().padStart(3, '0'); // e.g., 001, 002

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

                // Load related data (Tasks, Deliverables, BDM Files if needed)
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
                 if (['design_lead', 'designer'].includes(req.user.role) && projectData.proposalId) {
                     const filesSnapshot = await db.collection('files')
                         .where('proposalId', '==', projectData.proposalId)
                         .get();
                     // Filter for project files (type 'project' or null/undefined)
                     projectData.bdmFiles = filesSnapshot.docs
                         .map(d => ({ id: d.id, ...d.data() }))
                         .filter(f => f.fileType === 'project' || !f.fileType);
                 }


                return res.status(200).json({ success: true, data: projectData });
            }

            // Get projects list based on role
            let query = db.collection('projects').orderBy('createdAt', 'desc');

            if (req.user.role === 'design_lead') {
                query = query.where('designLeadUid', '==', req.user.uid);
            } else if (req.user.role === 'designer') {
                query = query.where('assignedDesignerUids', 'array-contains', req.user.uid);
            } else if (req.user.role === 'bdm') {
                 query = query.where('bdmUid', '==', req.user.uid);
            }
            // COO, Director, Accounts see all

            const snapshot = await query.get();
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json({ success: true, data: projects });
        }

        // ============================================
        // POST - Create Project from Proposal
        // ============================================
        if (req.method === 'POST') {
            // Check for the specific action from query parameter
            if (req.query.action === 'create_from_proposal') {
                const { proposalId } = req.body;

                if (!proposalId) {
                    return res.status(400).json({ success: false, error: 'Missing proposal ID' });
                }

                // Only COO or Director can create projects this way
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ success: false, error: 'Only COO or Director can create projects from proposals' });
                }

                const proposalRef = db.collection('proposals').doc(proposalId);
                const proposalDoc = await proposalRef.get();

                if (!proposalDoc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }

                const proposalData = proposalDoc.data();

                // Check if proposal status is 'won' and project not already created
                if (proposalData.status !== 'won') {
                    return res.status(400).json({ success: false, error: 'Proposal must be marked as WON before creating a project' });
                }
                if (proposalData.projectCreated) {
                    return res.status(400).json({ success: false, error: 'Project has already been created for this proposal' });
                }

                // Generate Project Code
                const projectCode = await generateProjectCode(proposalData.clientCompany);

                // Create the new project document data
                const newProject = {
                    proposalId: proposalId,
                    projectName: proposalData.projectName,
                    clientCompany: proposalData.clientCompany,
                    projectCode: projectCode,
                    scopeOfWork: proposalData.scopeOfWork || '',
                    projectType: proposalData.projectType || '',
                    country: proposalData.country || '',
                    timeline: proposalData.timeline || '',
                    priority: proposalData.priority || 'Medium',
                    quoteValue: proposalData.pricing?.quoteValue || 0,
                    currency: proposalData.pricing?.currency || 'USD',
                    totalHours: proposalData.estimation?.totalHours || 0,
                    services: proposalData.estimation?.services || [],
                    bdmUid: proposalData.createdByUid,
                    bdmName: proposalData.createdByName,
                    status: 'pending_setup', // Initial status before allocation
                    designStatus: 'not_started',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdBy: req.user.name, // Log who created the project entry
                    createdByUid: req.user.uid,
                    // Fields to be filled by allocation/assignment later
                    designLeadUid: null,
                    designLeadName: null,
                    allocationDate: null,
                    assignedDesignerUids: [],
                    assignedDesignerNames: [],
                    assignmentDate: null,
                    targetCompletionDate: null,
                    projectStartDate: null
                };

                // Add the project to Firestore
                const projectRef = await db.collection('projects').add(newProject);

                // Update the proposal to mark project as created
                await proposalRef.update({
                    projectCreated: true,
                    projectId: projectRef.id, // Link project ID back to proposal
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });

                // Log activity
                await db.collection('activities').add({
                    type: 'project_created',
                    details: `Project created from won proposal: ${newProject.projectName} (${projectCode})`,
                    performedByName: req.user.name,
                    performedByRole: req.user.role,
                    performedByUid: req.user.uid,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    projectId: projectRef.id,
                    proposalId: proposalId,
                    projectName: newProject.projectName
                });

                 // Notify COO (even if they created it, confirms action) and relevant BDM
                 const notifications = [];
                 notifications.push({
                     type: 'project_created',
                     recipientRole: 'coo', // Or specific UIDs if needed
                     message: `Project ${projectCode} (${newProject.projectName}) created. Ready for allocation.`,
                     projectId: projectRef.id,
                     projectName: newProject.projectName,
                     priority: 'high'
                 });
                 if (newProject.bdmUid && newProject.bdmUid !== req.user.uid) { // Don't notify self
                    notifications.push({
                        type: 'project_created',
                        recipientUid: newProject.bdmUid,
                        recipientRole: 'bdm',
                        message: `Project ${projectCode} (${newProject.projectName}) has been created from your won proposal.`,
                        projectId: projectRef.id,
                        priority: 'normal'
                    });
                 }

                 for (const notification of notifications) {
                     await db.collection('notifications').add({
                         ...notification,
                         createdAt: admin.firestore.FieldValue.serverTimestamp(),
                         isRead: false
                     });
                 }


                return res.status(201).json({ success: true, data: { id: projectRef.id, ...newProject } });

            } else {
                return res.status(400).json({ success: false, error: 'Invalid action or missing action parameter for POST request' });
            }
        }


        // ============================================
        // PUT - Update project (Allocation, Assignment, Status)
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

            // Action: COO allocating to Design Lead
            if (action === 'allocate_to_design_lead') {
                 if (!['coo', 'director'].includes(req.user.role)) {
                     return res.status(403).json({ success: false, error: 'Only COO or Director can allocate projects' });
                 }
                 const designLeadUid = data.designLeadUid;
                 if (!designLeadUid) {
                    return res.status(400).json({ success: false, error: 'Design Lead UID is required' });
                 }
                 const designLeadDoc = await db.collection('users').doc(designLeadUid).get();
                 if (!designLeadDoc.exists || designLeadDoc.data().role !== 'design_lead') {
                    return res.status(400).json({ success: false, error: 'Invalid Design Lead selected' });
                 }
                 const designLeadData = designLeadDoc.data();

                 updates = {
                     designLeadUid: designLeadUid,
                     designLeadName: designLeadData.name,
                     designLeadEmail: designLeadData.email,
                     allocationDate: admin.firestore.FieldValue.serverTimestamp(),
                     allocatedBy: req.user.name,
                     allocatedByUid: req.user.uid,
                     projectStartDate: data.projectStartDate || admin.firestore.FieldValue.serverTimestamp(),
                     targetCompletionDate: data.targetCompletionDate || null,
                     allocationNotes: data.allocationNotes || '',
                     status: 'active', // Project becomes active once allocated
                     designStatus: 'pending_assignment' // Ready for DL to assign designers
                 };
                 activityDetail = `Project allocated to Design Lead: ${designLeadData.name} by ${req.user.name}`;

                 // Notify Design Lead
                 notifications.push({
                     type: 'project_allocated',
                     recipientUid: designLeadUid,
                     recipientRole: 'design_lead',
                     message: `New project allocated: "${project.projectName}". Ready for designer assignment.`,
                     projectId: id,
                     projectName: project.projectName,
                     priority: 'high'
                 });
                 // Notify BDM
                 if (project.bdmUid) {
                     notifications.push({
                         type: 'project_allocated_update',
                         recipientUid: project.bdmUid,
                         recipientRole: 'bdm',
                         message: `Project "${project.projectName}" allocated to ${designLeadData.name}.`,
                         projectId: id,
                         priority: 'normal'
                     });
                 }

            }
            // Action: Design Lead assigning Designers
            else if (action === 'assign_designers') {
                 if (req.user.role === 'design_lead' && project.designLeadUid !== req.user.uid) {
                     return res.status(403).json({ success: false, error: 'You are not the allocated Design Lead' });
                 }
                 if (!['design_lead', 'coo', 'director'].includes(req.user.role)) {
                     return res.status(403).json({ success: false, error: 'Only allocated Design Lead, COO, or Director can assign designers' });
                 }

                 const designerUids = data.designerUids || [];
                 const validatedDesigners = [];
                 for (const uid of designerUids) {
                     const userDoc = await db.collection('users').doc(uid).get();
                     if (userDoc.exists && userDoc.data().role === 'designer') {
                         validatedDesigners.push({ uid: uid, name: userDoc.data().name, email: userDoc.data().email });
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
                     designStatus: validatedDesigners.length > 0 ? 'in_progress' : 'pending_assignment' // If designers assigned, start progress
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

                 // Maybe notify COO/BDM? (Optional)

            }
            // Action: Update Design Status (e.g., by Design Lead or system based on tasks)
             else if (action === 'update_design_status') {
                 if (!['design_lead', 'coo', 'director'].includes(req.user.role)) { // Example roles
                      return res.status(403).json({ success: false, error: 'Unauthorized to update design status' });
                 }
                 if (!data.designStatus) {
                      return res.status(400).json({ success: false, error: 'Missing designStatus in data' });
                 }
                 updates = {
                     designStatus: data.designStatus,
                     // Optionally add remarks or specific status timestamps
                     ...(data.remarks && { statusRemarks: data.remarks })
                 };
                 activityDetail = `Design status updated to ${data.designStatus} by ${req.user.name}`;

                 // Notify relevant parties based on status change (e.g., notify Accounts if 'submitted')
                 if (data.designStatus === 'submitted') {
                     notifications.push({
                         type: 'design_submitted_for_billing',
                         recipientRole: 'accounts',
                         message: `Design submitted for project "${project.projectName}". Ready for invoicing.`,
                         projectId: id,
                         projectName: project.projectName,
                         priority: 'high'
                     });
                     // Maybe notify BDM too
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

            // --- Add other PUT actions as needed ---

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
        // DELETE - Delete project (Use with caution!)
        // ============================================
        if (req.method === 'DELETE') {
             const { id } = req.query;
             if (!id) {
                 return res.status(400).json({ success: false, error: 'Missing project ID' });
             }

             // Add role check - e.g., only Director or Admin?
             if (!['director'].includes(req.user.role)) {
                return res.status(403).json({ success: false, error: 'Unauthorized to delete projects' });
             }

             const projectRef = db.collection('projects').doc(id);
             const projectDoc = await projectRef.get();
             if (!projectDoc.exists) {
                 return res.status(404).json({ success: false, error: 'Project not found' });
             }

             // Consider implications: Delete related tasks? Deliverables? Keep proposal link?
             // Simple deletion for now:
             await projectRef.delete();

              // Log activity
              await db.collection('activities').add({
                  type: 'project_deleted',
                  details: `Project deleted: ${projectDoc.data().projectName} (${projectDoc.data().projectCode})`,
                  performedByName: req.user.name,
                  performedByRole: req.user.role,
                  performedByUid: req.user.uid,
                  timestamp: admin.firestore.FieldValue.serverTimestamp(),
                  projectId: id
              });

             // Potentially update the original proposal's projectCreated flag?
             if(projectDoc.data().proposalId) {
                await db.collection('proposals').doc(projectDoc.data().proposalId).update({
                    projectCreated: false,
                    projectId: admin.firestore.FieldValue.delete() // Remove link
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
