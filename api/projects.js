// api/projects.js - COMPLETE with Multi-Designer Allocation Support
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const { sendEmailNotification } = require('./email'); // ✅ EMAIL IMPORT

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
    
                // 3. The new variation number is the max found + 1
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
            
            // Get all projects (with optional filters)
            let query = db.collection('projects');
            
            // Handle assignedToMe filter for designers
            const assignedToMe = req.query.assignedToMe;
            if (assignedToMe === 'true') {
                // Get projects where the current user is in assignedDesignerUids array
                // or where they are the designLeadUid
                const userUid = req.user.uid;
                
                // Firestore doesn't support OR queries directly, so we need to make two queries
                const assignedSnapshot = await db.collection('projects')
                    .where('assignedDesignerUids', 'array-contains', userUid)
                    .orderBy('createdAt', 'desc')
                    .get();
                
                const leadSnapshot = await db.collection('projects')
                    .where('designLeadUid', '==', userUid)
                    .orderBy('createdAt', 'desc')
                    .get();
                
                // Combine and deduplicate results
                const projectsMap = new Map();
                
                assignedSnapshot.docs.forEach(doc => {
                    projectsMap.set(doc.id, { id: doc.id, ...doc.data() });
                });
                
                leadSnapshot.docs.forEach(doc => {
                    if (!projectsMap.has(doc.id)) {
                        projectsMap.set(doc.id, { id: doc.id, ...doc.data() });
                    }
                });
                
                const projects = Array.from(projectsMap.values());
                
                // Sort by createdAt descending
                projects.sort((a, b) => {
                    const dateA = a.createdAt?._seconds || 0;
                    const dateB = b.createdAt?._seconds || 0;
                    return dateB - dateA;
                });
                
                return res.status(200).json({ 
                    success: true, 
                    data: projects 
                });
            }
            
            // Standard query with optional status filter
            query = query.orderBy('createdAt', 'desc');
            
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
                    
                    // Initialize all hour fields
                    maxAllocatedHours: 0,
                    additionalHours: 0,
                    totalAllocatedHours: 0,
                    hoursLogged: 0,
                    
                    // Get estimated hours from proposal if available (This is your budget)
                    estimatedHours: proposal.estimation?.totalHours || 0,
                    remainingHours: proposal.estimation?.totalHours || 0, // Initialize remaining hours
                    
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
        // PUT - Update project (Multiple allocation types)
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
            
            // ============================================
            // NEW: COO Multi-Designer Allocation
            // ============================================
            if (action === 'allocate_to_multiple_designers') {
                console.log('🎯 Allocating project to multiple designers');
                
                // Only COO or Director can allocate
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can allocate projects to multiple designers' 
                    });
                }
                
                const { 
                    totalAllocatedHours, 
                    designerAllocations,
                    targetCompletionDate,
                    priority,
                    allocationNotes,
                    projectStartDate,
                    assignedDesignerUids,
                    assignedDesignerNames,
                    designerHours
                } = data;
                
                // Validate required fields
                if (!assignedDesignerUids || assignedDesignerUids.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'At least one designer must be assigned'
                    });
                }
                
                // totalAllocatedHours comes from frontend (previous + current session hours)
                const finalTotalAllocatedHours = parseFloat(totalAllocatedHours) || 0;
                
                if (finalTotalAllocatedHours <= 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'Total allocated hours must be greater than 0'
                    });
                }
                
                // Validate no duplicate designers
                const uniqueUids = new Set(assignedDesignerUids);
                if (uniqueUids.size !== assignedDesignerUids.length) {
                    return res.status(400).json({
                        success: false,
                        error: 'Duplicate designers detected'
                    });
                }
                
                // Validate all designers from database
                const validatedDesigners = [];
                for (const allocation of designerAllocations) {
                    const userDoc = await db.collection('users').doc(allocation.designerUid).get();
                    
                    if (!userDoc.exists) {
                        return res.status(400).json({
                            success: false,
                            error: `Designer not found: ${allocation.designerName}`
                        });
                    }
                    
                    const userData = userDoc.data();
                    if (!['designer', 'design_lead'].includes(userData.role)) {
                        return res.status(400).json({
                            success: false,
                            error: `User ${userData.name} is not a designer or design lead`
                        });
                    }
                    
                    validatedDesigners.push({
                        uid: allocation.designerUid,
                        name: userData.name,
                        email: userData.email,
                        allocatedHours: allocation.allocatedHours,
                        specificNotes: allocation.specificNotes || ''
                    });
                }
                
                // Prepare update data
                updates = {
                    // Status update
                    status: 'in_progress',
                    designStatus: 'in_progress',
                    
                    // Multi-designer allocation
                    assignedDesignerUids: assignedDesignerUids,
                    assignedDesignerNames: assignedDesignerNames,
                    designerHours: designerHours,
                    totalAllocatedHours: finalTotalAllocatedHours,
                    
                    // 🚨 CRITICAL FIX: Calculate and save the remaining hours
                    // Assumes total project budget is in project.estimatedHours
                    remainingHours: project.estimatedHours - finalTotalAllocatedHours,
                    
                    // Store complete designer allocation details
                    designerAllocations: designerAllocations,
                    
                    // Project details
                    targetCompletionDate: targetCompletionDate || null,
                    priority: priority || 'Normal',
                    allocationNotes: allocationNotes || '',
                    projectStartDate: projectStartDate || new Date().toISOString(),
                    
                    // Tracking
                    allocatedBy: req.user.name,
                    allocatedByUid: req.user.uid,
                    allocationDate: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    
                    // Initialize hours tracking
                    hoursLogged: 0
                };
                
                activityDetail = `Project allocated to ${validatedDesigners.length} designer(s) with ${finalTotalAllocatedHours} total hours by ${req.user.name}`;
                
                // Send notifications and emails to each designer
                for (const designer of validatedDesigners) {
                    // In-app notification
                    notifications.push({
                        type: 'project_allocated_multi',
                        recipientUid: designer.uid,
                        recipientRole: 'designer',
                        message: `New project allocated: "${project.projectName}" (${designer.allocatedHours} hours)`,
                        projectId: id,
                        projectName: project.projectName,
                        clientCompany: project.clientCompany,
                        allocatedBy: req.user.name,
                        allocatedHours: designer.allocatedHours,
                        specificNotes: designer.specificNotes,
                        priority: 'high'
                    });
                    
                    // Send email notification
                    console.log(`\n📧 Sending allocation email to ${designer.name}...`);
                    try {
                        const emailResult = await sendEmailNotification('project.allocated_designer', {
                            projectName: project.projectName || 'Project',
                            projectNumber: project.projectNumber || project.projectCode || 'N/A',
                            clientName: project.clientCompany || 'Client',
                            designerEmail: designer.email,
                            designerName: designer.name,
                            allocatedHours: designer.allocatedHours,
                            specificNotes: designer.specificNotes,
                            generalNotes: allocationNotes || '',
                            targetDate: targetCompletionDate ? new Date(targetCompletionDate).toLocaleDateString() : 'TBD',
                            priority: priority || 'Normal',
                            allocatedBy: req.user.name,
                            projectId: id
                        });
                        
                        if (emailResult.success) {
                            console.log(`✅ Email sent to ${designer.name}`);
                        } else {
                            console.error('⚠️ Email failed:', emailResult.error);
                        }
                    } catch (emailError) {
                        console.error('❌ Email error for', designer.name, ':', emailError);
                    }
                }
                
                // Notify BDM
                if (project.bdmUid) {
                    notifications.push({
                        type: 'project_allocated',
                        recipientUid: project.bdmUid,
                        recipientRole: 'bdm',
                        message: `Project "${project.projectName}" has been allocated to ${validatedDesigners.length} designers`,
                        projectId: id,
                        priority: 'normal'
                    });
                }
                
                console.log('✅ Project allocated to', validatedDesigners.length, 'designers');
            }
            
            // ============================================
            // Direct Designer Allocation (from COO) - Single Designer
            // ============================================
            else if (action === 'allocate_directly_to_designer') {
                // Only COO or Director can allocate
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can allocate projects directly to designers' 
                    });
                }
                
                const designerUid = data.designerUid;
                if (!designerUid) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Designer UID is required' 
                    });
                }
                
                // Validate designer
                const designerDoc = await db.collection('users').doc(designerUid).get();
                if (!designerDoc.exists) {
                    return res.status(404).json({ 
                        success: false, 
                        error: 'Designer not found' 
                    });
                }
                
                const designerData = designerDoc.data();
                if (!['designer', 'design_lead'].includes(designerData.role)) {
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Selected user is not a designer' 
                    });
                }
                
                const estimatedHours = parseFloat(data.estimatedHours || 0);
                
                updates = {
                    assignedDesignerUids: data.assignedDesignerUids || [designerUid],
                    assignedDesignerNames: data.assignedDesignerNames || [designerData.name],
                    designerHours: data.designerHours || { [designerUid]: estimatedHours },
                    totalAllocatedHours: estimatedHours,
                    // Update remaining hours based on this single allocation
                    remainingHours: project.estimatedHours - estimatedHours,
                    allocationDate: admin.firestore.FieldValue.serverTimestamp(),
                    allocatedBy: req.user.name,
                    allocatedByUid: req.user.uid,
                    projectStartDate: data.projectStartDate || new Date().toISOString(),
                    targetCompletionDate: data.targetCompletionDate || null,
                    allocationNotes: data.allocationNotes || '',
                    status: 'in_progress',
                    designStatus: 'in_progress',
                    hoursLogged: 0
                };
                
                activityDetail = `Project allocated directly to Designer: ${designerData.name} with ${estimatedHours} hours`;
                
                // Notify designer
                notifications.push({
                    type: 'project_allocated',
                    recipientUid: designerUid,
                    recipientRole: 'designer',
                    message: `New project allocated: "${project.projectName}" (${estimatedHours} hours)`,
                    projectId: id,
                    projectName: project.projectName,
                    clientCompany: project.clientCompany,
                    allocatedBy: req.user.name,
                    priority: 'high'
                });
            }
            
            // ============================================
            // Assign Designers (COO/Director Only)
            // ============================================
            else if (action === 'assign_designers') {
                // Only COO or Director can assign designers
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can assign designers' 
                    });
                }
                
                const designerUids = data.designerUids || [];
                const designerNames = data.designerNames || [];
                const designerEmails = data.designerEmails || [];
                const designerHoursMap = data.designerHours || {};
                const totalAllocatedHours = data.totalAllocatedHours || 0;
                
                // Validate at least one designer is selected
                if (designerUids.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'At least one designer must be assigned'
                    });
                }
                
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
                for (let i = 0; i < designerUids.length; i++) {
                    const uid = designerUids[i];
                    const userDoc = await db.collection('users').doc(uid).get();
                    
                    if (!userDoc.exists) {
                        return res.status(400).json({
                            success: false,
                            error: `Designer not found: ${designerNames[i] || uid}`
                        });
                    }
                    
                    const userData = userDoc.data();
                    if (userData.role !== 'designer') {
                        return res.status(400).json({
                            success: false,
                            error: `User ${userData.name} is not a designer`
                        });
                    }
                    
                    // Use email from frontend or Firestore
                    const designerEmail = designerEmails[i] || userData.email;
                    
                    validatedDesigners.push({
                        uid: uid,
                        name: userData.name,
                        email: designerEmail
                    });
                    
                    // Notify each designer
                    notifications.push({
                        type: 'project_assigned',
                        recipientUid: uid,
                        recipientRole: 'designer',
                        message: `New project assigned: "${project.projectName}" (${designerHoursMap[uid] || 0} hours allocated)`,
                        projectId: id,
                        projectName: project.projectName,
                        clientCompany: project.clientCompany,
                        assignedBy: req.user.name,
                        allocatedHours: designerHoursMap[uid] || 0,
                        priority: 'high'
                    });
                    
                    // Send email notification
                    console.log(`\n📧 Sending designer allocation email for ${userData.name}...`);
                    try {
                        const emailResult = await sendEmailNotification('designer.allocated', {
                            projectName: project.projectName || 'Project',
                            clientName: project.clientCompany || project.clientName || 'Client',
                            designerEmail: designerEmail,
                            designerRole: 'Designer',
                            allocatedBy: req.user.name,
                            projectId: id
                        });
                        
                        if (emailResult.success) {
                            console.log(`✅ Email sent to ${emailResult.recipients} recipients`);
                        } else {
                            console.error('⚠️ Email failed:', emailResult.error);
                        }
                    } catch (emailError) {
                        console.error('❌ Email error:', emailError);
                    }
                }
                
                updates = {
                    assignedDesigners: validatedDesigners.map(d => d.uid),
                    assignedDesignerNames: validatedDesigners.map(d => d.name),
                    assignedDesignerEmails: validatedDesigners.map(d => d.email),
                    assignmentDate: admin.firestore.FieldValue.serverTimestamp(),
                    assignedBy: req.user.name,
                    assignedByUid: req.user.uid,
                    assignedDesignerHours: designerHoursMap,
                    totalAllocatedHours: totalAllocatedHours,
                    hoursLogged: 0,
                    status: 'in_progress',
                    designStatus: 'in_progress'
                };
                
                activityDetail = `Designers assigned: ${validatedDesigners.map(d => d.name).join(', ')} with a total of ${totalAllocatedHours} hours.`;
            }

            // ============================================
            // Continue Allocation - Add more designers to partially allocated project
            // ============================================
            else if (action === 'continue_allocation') {
                console.log('🔄 Continue allocation - adding more designers');
                
                // Only COO or Director can continue allocation
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can continue project allocation' 
                    });
                }
                
                const { newAllocations, additionalHours } = data;
                
                if (!newAllocations || newAllocations.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'At least one new designer allocation is required'
                    });
                }
                
                // Get existing allocations
                const existingAllocations = project.designerAllocations || [];
                const existingDesignerUids = project.assignedDesignerUids || [];
                const existingDesignerNames = project.assignedDesignerNames || [];
                const existingDesignerHours = project.designerHours || {};
                const currentTotalHours = parseFloat(project.totalAllocatedHours) || 0;
                
                // Validate and process new allocations
                const validatedNewAllocations = [];
                for (const allocation of newAllocations) {
                    const userDoc = await db.collection('users').doc(allocation.designerUid).get();
                    
                    if (!userDoc.exists) {
                        return res.status(400).json({
                            success: false,
                            error: `Designer not found: ${allocation.designerName}`
                        });
                    }
                    
                    const userData = userDoc.data();
                    if (!['designer', 'design_lead'].includes(userData.role)) {
                        return res.status(400).json({
                            success: false,
                            error: `User ${userData.name} is not a designer or design lead`
                        });
                    }
                    
                    validatedNewAllocations.push({
                        uid: allocation.designerUid,
                        name: userData.name,
                        email: userData.email,
                        allocatedHours: parseFloat(allocation.allocatedHours) || 0,
                        specificNotes: allocation.specificNotes || ''
                    });
                }
                
                // Merge new allocations with existing
                const mergedDesignerUids = [...existingDesignerUids];
                const mergedDesignerNames = [...existingDesignerNames];
                const mergedDesignerHours = { ...existingDesignerHours };
                const mergedAllocations = [...existingAllocations];
                
                for (const newAlloc of validatedNewAllocations) {
                    if (!mergedDesignerUids.includes(newAlloc.uid)) {
                        mergedDesignerUids.push(newAlloc.uid);
                        mergedDesignerNames.push(newAlloc.name);
                    }
                    // Add or update hours
                    mergedDesignerHours[newAlloc.uid] = (mergedDesignerHours[newAlloc.uid] || 0) + newAlloc.allocatedHours;
                    mergedAllocations.push({
                        designerUid: newAlloc.uid,
                        designerName: newAlloc.name,
                        designerEmail: newAlloc.email,
                        allocatedHours: newAlloc.allocatedHours,
                        specificNotes: newAlloc.specificNotes,
                        allocatedAt: new Date().toISOString()
                    });
                }
                
                const newTotalHours = currentTotalHours + parseFloat(additionalHours);
                
                updates = {
                    assignedDesignerUids: mergedDesignerUids,
                    assignedDesignerNames: mergedDesignerNames,
                    designerHours: mergedDesignerHours,
                    designerAllocations: mergedAllocations,
                    totalAllocatedHours: newTotalHours,
                    remainingHours: (project.estimatedHours || 0) - newTotalHours,
                    lastAllocationUpdate: admin.firestore.FieldValue.serverTimestamp(),
                    lastAllocatedBy: req.user.name,
                    lastAllocatedByUid: req.user.uid
                };
                
                activityDetail = `Additional allocation: ${validatedNewAllocations.length} designer(s) added with ${additionalHours} hours by ${req.user.name}. New total: ${newTotalHours} hours.`;
                
                // Send notifications to new designers
                for (const designer of validatedNewAllocations) {
                    notifications.push({
                        type: 'project_allocated_additional',
                        recipientUid: designer.uid,
                        recipientRole: 'designer',
                        message: `Additional allocation: "${project.projectName}" (${designer.allocatedHours} hours)`,
                        projectId: id,
                        projectName: project.projectName,
                        clientCompany: project.clientCompany,
                        allocatedBy: req.user.name,
                        allocatedHours: designer.allocatedHours,
                        priority: 'high'
                    });
                    
                    // Send email notification
                    console.log(`\n📧 Sending additional allocation email to ${designer.name}...`);
                    try {
                        const emailResult = await sendEmailNotification('project.allocated_designer', {
                            projectName: project.projectName || 'Project',
                            projectNumber: project.projectNumber || project.projectCode || 'N/A',
                            clientName: project.clientCompany || 'Client',
                            designerEmail: designer.email,
                            designerName: designer.name,
                            allocatedHours: designer.allocatedHours,
                            specificNotes: designer.specificNotes,
                            allocatedBy: req.user.name,
                            projectId: id
                        });
                        
                        if (emailResult.success) {
                            console.log(`✅ Email sent to ${designer.name}`);
                        } else {
                            console.error('⚠️ Email failed:', emailResult.error);
                        }
                    } catch (emailError) {
                        console.error('❌ Email error for', designer.name, ':', emailError);
                    }
                }
                
                console.log('✅ Continue allocation completed:', validatedNewAllocations.length, 'new designers');
            }

            // ============================================
            // Mark Project Complete (COO/Director Only)
            // ============================================
            else if (action === 'mark_complete') {
                // Only COO or Director can mark projects complete
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO or Director can mark projects as complete' 
                    });
                }
                
                updates = {
                    status: 'completed',
                    designStatus: 'completed',
                    completedAt: admin.firestore.FieldValue.serverTimestamp(),
                    completedBy: req.user.name,
                    completedByUid: req.user.uid
                };
                
                activityDetail = `Project marked as COMPLETED by ${req.user.name}.`;
                
                // Notify the Accounts team
                notifications.push({
                    type: 'project_completed',
                    recipientRole: 'accounts',
                    message: `Project "${project.projectName}" is complete and ready for invoicing.`,
                    projectId: id,
                    projectName: project.projectName,
                    clientCompany: project.clientCompany,
                    priority: 'high'
                });

                // Also notify BDM
                if (project.bdmUid) {
                    notifications.push({
                        type: 'project_completed',
                        recipientUid: project.bdmUid,
                        recipientRole: 'bdm',
                        message: `Your project "${project.projectName}" has been marked complete by the design team.`,
                        projectId: id,
                        priority: 'normal'
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
