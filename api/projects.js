// api/projects.js - UPDATED WITH ALLOCATION BUDGET TRACKING AND LOCKING LOGIC
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const { sendEmailNotification } = require('./email');

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
        // GET - Retrieve projects OR generate variation code
        // ============================================
        if (req.method === 'GET') {
            const { id, action, parentId, status } = req.query;

            // Generate Variation Code Logic
            if (action === 'generate-variation-code') {
                if (!parentId) {
                    return res.status(400).json({ success: false, error: 'Parent Project ID (parentId) is required.' });
                }
    
                const projectDoc = await db.collection('projects').doc(parentId).get();
                if (!projectDoc.exists) {
                    return res.status(404).json({ success: false, error: 'Parent project not found.' });
                }
                const project = projectDoc.data();
                const baseProjectCode = project.projectCode;
    
                const variationsSnapshot = await db.collection('variations')
                    .where('parentProjectId', '==', parentId)
                    .get();
    
                let maxNum = 0;
                const variationRegex = /-V(\d+)$/;
    
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
    
                const newVariationNum = maxNum + 1;
                const newVariationCode = `${baseProjectCode}-V${newVariationNum}`;
    
                return res.status(200).json({
                    success: true,
                    variationCode: newVariationCode,
                    variationNumber: newVariationNum
                });
            }

            // Get single project by ID
            if (id) {
                const projectDoc = await db.collection('projects').doc(id).get();
                if (!projectDoc.exists) {
                    return res.status(404).json({ success: false, error: 'Project not found' });
                }
                
                return res.status(200).json({ 
                    success: true, 
                    data: { id: projectDoc.id, ...projectDoc.data() }
                });
            }
            
            // Get all projects (with optional status filter)
            let query = db.collection('projects').orderBy('createdAt', 'desc');
            
            if (status) {
                query = query.where('status', '==', status);
            }
            
            const snapshot = await query.get();
            const projects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return res.status(200).json({ 
                success: true, 
                data: projects 
            });
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
                    const existingProjectDoc = await db.collection('projects').doc(proposal.projectId).get();
                    if(existingProjectDoc.exists) {
                        return res.status(200).json({
                            success: true,
                            message: 'Project already exists for this proposal',
                            projectId: proposal.projectId 
                        });
                    }
                }
                
                // ============================================
                // ✅ CRITICAL FIX: Handle Tonnage vs Hours Logic
                // ============================================
                
                const estimationHours = parseFloat(proposal.estimation?.totalHours || 0);
                const estimationUsedTonnage = proposal.estimation?.usedTonnageForDesign || false;
                const tonnageValue = proposal.estimation?.tonnageValue || null;
                
                let maxAllocatedHours = null;
                let maxHoursSource = 'awaiting_coo_manual_entry';
                
                // SCENARIO A: Estimator entered HOURS (not tonnage)
                if (estimationHours > 0 && !estimationUsedTonnage) {
                    maxAllocatedHours = estimationHours;
                    maxHoursSource = 'from_estimation_hours';
                    console.log(`✅ Project Creation - Scenario A: Using estimation hours (${estimationHours} hrs)`);
                }
                // SCENARIO B: Estimator used TONNAGE - COO will enter hours manually
                else if (estimationUsedTonnage) {
                    maxAllocatedHours = null; // COO must enter manually
                    maxHoursSource = 'awaiting_coo_manual_entry';
                    console.log(`⚠️ Project Creation - Scenario B: Tonnage used (${tonnageValue} tons) - COO manual entry required`);
                }
                // Fallback
                else if (estimationHours > 0) {
                    maxAllocatedHours = estimationHours;
                    maxHoursSource = 'from_estimation_fallback';
                    console.log(`⚠️ Project Creation - Fallback: Using estimation hours (${estimationHours} hrs)`);
                }
                
                // Create the project
                const projectData = {
                    proposalId: proposalId,
                    projectName: proposal.projectName,
                    projectCode: proposal.pricing?.projectNumber || 'PENDING',
                    projectNumber: proposal.pricing?.projectNumber || 'PENDING',
                    clientCompany: proposal.clientCompany,
                    clientContact: proposal.clientContact || '',
                    clientEmail: proposal.clientEmail || '',
                    clientPhone: proposal.clientPhone || '',
                    location: proposal.country || '',
                    bdmName: proposal.createdByName || 'Unknown',
                    bdmUid: proposal.createdByUid || '',
                    bdmEmail: proposal.createdByEmail || proposal.bdmEmail || '',
                    quoteValue: proposal.pricing?.quoteValue || 0,
                    currency: proposal.pricing?.currency || 'USD',
                    status: 'pending_allocation',
                    designStatus: 'not_started',
                    
                    // ============================================
                    // ✅ NEW CRITICAL FIELDS FOR ALLOCATION LOGIC
                    // ============================================
                    maxAllocatedHours: maxAllocatedHours,           // Budget ceiling (null if tonnage used)
                    maxHoursSource: maxHoursSource,                 // Source tracking
                    totalAllocatedHours: 0,                         // Sum of designer allocations
                    allocationStatus: 'not_started',                // Status: not_started | partial | completed
                    
                    // Keep estimation data for reference
                    estimation: proposal.estimation || null,
                    
                    // Legacy fields (for compatibility)
                    additionalHours: 0,
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
                    details: `Project created from proposal: ${proposal.projectName} (Budget: ${maxAllocatedHours ? maxAllocatedHours + ' hrs' : 'Awaiting COO entry'})`,
                    performedByName: req.user.name,
                    performedByRole: req.user.role,
                    performedByUid: req.user.uid,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    projectId: projectRef.id,
                    proposalId: proposalId
                });
                
                return res.status(201).json({ 
                    success: true, 
                    projectId: projectRef.id,
                    message: 'Project created successfully',
                    allocationInfo: {
                        maxAllocatedHours: maxAllocatedHours,
                        maxHoursSource: maxHoursSource,
                        requiresManualEntry: maxAllocatedHours === null
                    }
                });
            }
            
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid action' 
            });
        }

        // ============================================
        // PUT - Update project (Allocation Logic)
        // ============================================
        if (req.method === 'PUT') {
            const { id } = req.query;
            const { action, data } = req.body;
            
            if (!id) return res.status(400).json({ success: false, error: 'Missing project ID' });
            if (!action) return res.status(400).json({ success: false, error: 'Missing action parameter' });
            
            const projectRef = db.collection('projects').doc(id);
            const projectDoc = await projectRef.get();
            
            if (!projectDoc.exists) return res.status(404).json({ success: false, error: 'Project not found' });
            
            const project = projectDoc.data();
            let updates = {};
            let activityDetail = '';
            const notifications = [];
            
            // ============================================
            // COO Multi-Designer Allocation
            // ============================================
            if (action === 'allocate_to_multiple_designers') {
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can allocate projects' 
                    });
                }
                
                const {
                    projectId,
                    maxAllocatedHours,      // ✅ NEW - Budget ceiling
                    maxHoursSource,         // ✅ NEW - Source tracking
                    totalAllocatedHours,    // ✅ UPDATED - New total after this allocation
                    designerAllocations,
                    targetCompletionDate,
                    priority,
                    allocationNotes,
                    isIncremental
                } = data;
                
                // Validate required fields
                if (!designerAllocations || designerAllocations.length === 0) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'At least one designer allocation is required' 
                    });
                }
                
                if (!maxAllocatedHours || maxAllocatedHours <= 0) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Total allocated hours must be greater than 0' 
                    });
                }
                
                // ============================================
                // ✅ CRITICAL: Validate Budget Not Exceeded
                // ============================================
                const newTotalAllocated = parseFloat(totalAllocatedHours);
                const budgetCeiling = parseFloat(maxAllocatedHours);
                
                if (newTotalAllocated > budgetCeiling + 0.1) { // 0.1 tolerance for float precision
                    const overage = (newTotalAllocated - budgetCeiling).toFixed(1);
                    return res.status(400).json({ 
                        success: false, 
                        error: `Allocation exceeds budget by ${overage} hours. Budget: ${budgetCeiling}, Attempting: ${newTotalAllocated}` 
                    });
                }
                
                // ============================================
                // ✅ CRITICAL: Calculate Allocation Status
                // ============================================
                let allocationStatus = 'not_started';
                if (newTotalAllocated > 0 && newTotalAllocated < budgetCeiling - 0.1) {
                    allocationStatus = 'partial';
                } else if (newTotalAllocated >= budgetCeiling - 0.1) {
                    allocationStatus = 'completed'; // ✅ LOCK
                }
                
                console.log(`📊 Allocation Status: ${allocationStatus} (${newTotalAllocated}/${budgetCeiling} hrs)`);
                
                // Prepare existing data for incremental updates
                const existingDesignerHours = { ...(project.designerHours || {}) };
                const existingAssignedUids = new Set(project.assignedDesignerUids || []);
                const existingAssignedNames = new Set(project.assignedDesignerNames || []);
                const existingDesignerEmails = new Set(project.assignedDesignerEmails || []);

                // Process new allocations (incremental addition)
                const newAllocations = designerAllocations || [];
                
                for (const alloc of newAllocations) {
                    const currentUid = alloc.designerUid;
                    const currentAmount = parseFloat(alloc.allocatedHours);
                    
                    // Add the new hours to the existing total for this designer
                    existingDesignerHours[currentUid] = (parseFloat(existingDesignerHours[currentUid]) || 0) + currentAmount;

                    // Add to lists if new
                    existingAssignedUids.add(currentUid);
                    existingAssignedNames.add(alloc.designerName);
                    existingDesignerEmails.add(alloc.designerEmail);
                    
                    // Send email notification
                    console.log(`\n📧 Sending designer allocation email (COO) for ${alloc.designerName}...`);
                    try {
                        const emailResult = await sendEmailNotification('designer.allocated', {
                            projectName: project.projectName || 'Project',
                            clientName: project.clientCompany || project.clientName || 'Client',
                            designerEmail: alloc.designerEmail,  
                            designerRole: 'Designer',
                            designManager: project.designLeadName || 'COO Office',
                            allocatedBy: req.user.name,
                            projectId: id
                        });
                        if (!emailResult.success) console.error('⚠️ Email failed:', emailResult.error);
                    } catch (emailError) {
                        console.error('❌ Email error:', emailError);
                    }
                    
                    // Add notification for newly assigned designers
                    notifications.push({
                        type: 'project_assigned_coo',
                        recipientUid: alloc.designerUid,
                        recipientRole: 'designer',
                        message: `New project assigned by COO: "${project.projectName}" (${alloc.allocatedHours} hours allocated)`,
                        projectId: id,
                        projectName: project.projectName,
                        clientCompany: project.clientCompany,
                        assignedBy: req.user.name,
                        allocatedHours: alloc.allocatedHours,
                        priority: 'high'
                    });
                }
                
                // Prepare update object
                updates = {
                    // ✅ CRITICAL FIELDS FOR BUDGET LOCKING
                    maxAllocatedHours: parseFloat(maxAllocatedHours),  // Lock the budget
                    maxHoursSource: maxHoursSource,                    // Track source
                    totalAllocatedHours: parseFloat(totalAllocatedHours), // New total usage
                    allocationStatus: allocationStatus,                // Status tracking
                    
                    // Designer details
                    designerHours: existingDesignerHours,
                    assignedDesignerUids: Array.from(existingAssignedUids),
                    assignedDesignerNames: Array.from(existingAssignedNames),
                    assignedDesignerEmails: Array.from(existingDesignerEmails),
                    
                    targetCompletionDate: targetCompletionDate || project.targetCompletionDate,
                    priority: priority || project.priority,
                    allocationNotes: allocationNotes || project.allocationNotes,
                    status: 'in_progress',
                    designStatus: 'in_progress',
                };
                
                // Set initial allocation metadata if this is the first allocation
                if (!project.allocationDate || (project.totalAllocatedHours || 0) === 0) {
                    updates.allocationDate = admin.firestore.FieldValue.serverTimestamp();
                    updates.allocatedBy = req.user.name;
                    updates.allocatedByUid = req.user.uid;
                }
                
                activityDetail = `COO Multi-Designer allocation: ${parseFloat(totalAllocatedHours).toFixed(1)} hrs allocated. Status: ${allocationStatus.replace('_', ' ')}.`;
                
                // Log completion if fully allocated
                if (allocationStatus === 'completed') {
                    console.log(`✅ PROJECT FULLY ALLOCATED: ${project.projectName} (${totalAllocatedHours}/${maxAllocatedHours} hrs)`);
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
                message: 'Project updated successfully',
                allocationInfo: {
                    totalAllocatedHours: updates.totalAllocatedHours,
                    maxAllocatedHours: updates.maxAllocatedHours,
                    allocationStatus: updates.allocationStatus
                }
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
            
            // Log activity
            await db.collection('activities').add({
                type: 'project_deleted',
                details: `Project deleted: ${project.projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: id,
                projectName: project.projectName
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Project deleted successfully' 
            });
        }

        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });

    } catch (error) {
        console.error('Error in projects handler:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

module.exports = allowCors(handler);
