// / api/proposals.js - FIXED VERSION with proper design_lead filtering
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const axios = require('axios'); // ⚠️ ADDED: For email API calls


const db = admin.firestore();
const bucket = admin.storage().bucket();

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
        // GET - Retrieve proposals
        // ============================================
        if (req.method === 'GET') {
            const { id } = req.query;
            
            if (id) {
                // Get single proposal
                const doc = await db.collection('proposals').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }
                
                const proposalData = doc.data();
                
                // BDM isolation
                if (req.user.role === 'bdm' && proposalData.createdByUid !== req.user.uid) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Access denied. You can only view your own proposals.' 
                    });
                }

                // FIXED: Design Lead isolation - only see proposals that became their projects
                if (req.user.role === 'design_lead') {
                    if (!proposalData.projectCreated || !proposalData.projectId) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal has not been converted to a project yet.' 
                        });
                    }
                    
                    // Check if the project is allocated to this design lead
                    const projectDoc = await db.collection('projects').doc(proposalData.projectId).get();
                    if (!projectDoc.exists || projectDoc.data().designLeadUid !== req.user.uid) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal is not allocated to you.' 
                        });
                    }
                }

                // FIXED: Designer isolation - only see proposals for projects they're assigned to
                if (req.user.role === 'designer') {
                    if (!proposalData.projectCreated || !proposalData.projectId) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal has not been converted to a project yet.' 
                        });
                    }
                    
                    // Check if designer is assigned to this project
                    const projectDoc = await db.collection('projects').doc(proposalData.projectId).get();
                    if (!projectDoc.exists || !(projectDoc.data().assignedDesignerUids || []).includes(req.user.uid)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal is not assigned to you.' 
                        });
                    }
                }
                
                return res.status(200).json({ success: true, data: { id: doc.id, ...proposalData } });
            }
            
            // Get all proposals with role-based filtering
            let proposals = [];

            // BDMs only see their own proposals
            if (req.user.role === 'bdm') {
                const query = db.collection('proposals')
                    .where('createdByUid', '==', req.user.uid)
                    .orderBy('createdAt', 'desc');
                const snapshot = await query.get();
                proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            // FIXED: Design Leads only see proposals that became projects allocated to them
            else if (req.user.role === 'design_lead') {
                // First, get all projects allocated to this design lead
                const projectsSnapshot = await db.collection('projects')
                    .where('designLeadUid', '==', req.user.uid)
                    .get();
                
                const proposalIds = projectsSnapshot.docs
                    .map(doc => doc.data().proposalId)
                    .filter(id => id); // Remove null/undefined

                if (proposalIds.length > 0) {
                    // Firestore 'in' queries limited to 10 items, so we batch
                    const batchSize = 10;
                    for (let i = 0; i < proposalIds.length; i += batchSize) {
                        const batch = proposalIds.slice(i, i + batchSize);
                        const proposalsSnapshot = await db.collection('proposals')
                            .where(admin.firestore.FieldPath.documentId(), 'in', batch)
                            .get();
                        
                        proposals.push(...proposalsSnapshot.docs.map(doc => ({ 
                            id: doc.id, 
                            ...doc.data() 
                        })));
                    }
                    // Sort by createdAt desc
                    proposals.sort((a, b) => {
                        const aTime = a.createdAt?.seconds || 0;
                        const bTime = b.createdAt?.seconds || 0;
                        return bTime - aTime;
                    });
                }
            }
            // FIXED: Designers only see proposals for projects they're assigned to
            else if (req.user.role === 'designer') {
                // First, get all projects assigned to this designer
                const projectsSnapshot = await db.collection('projects')
                    .where('assignedDesignerUids', 'array-contains', req.user.uid)
                    .get();
                
                const proposalIds = projectsSnapshot.docs
                    .map(doc => doc.data().proposalId)
                    .filter(id => id);

                if (proposalIds.length > 0) {
                    const batchSize = 10;
                    for (let i = 0; i < proposalIds.length; i += batchSize) {
                        const batch = proposalIds.slice(i, i + batchSize);
                        const proposalsSnapshot = await db.collection('proposals')
                            .where(admin.firestore.FieldPath.documentId(), 'in', batch)
                            .get();
                        
                        proposals.push(...proposalsSnapshot.docs.map(doc => ({ 
                            id: doc.id, 
                            ...doc.data() 
                        })));
                    }
                    proposals.sort((a, b) => {
                        const aTime = a.createdAt?.seconds || 0;
                        const bTime = b.createdAt?.seconds || 0;
                        return bTime - aTime;
                    });
                }
            }
            // COO, Director, Estimator, Accounts see all proposals
            else {
                const query = db.collection('proposals').orderBy('createdAt', 'desc');
                const snapshot = await query.get();
                proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            
            return res.status(200).json({ success: true, data: proposals });
        }

        // ============================================
        // POST - Create new proposal
        // ============================================
        if (req.method === 'POST') {
            const { 
                projectName, 
                clientCompany, 
                scopeOfWork, 
                projectType, 
                priority, 
                country, 
                timeline, 
                projectLinks 
            } = req.body;
            
            if (!projectName || !clientCompany || !scopeOfWork) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing required fields: projectName, clientCompany, scopeOfWork' 
                });
            }

            const newProposal = {
                projectName: projectName.trim(),
                clientCompany: clientCompany.trim(),
                projectType: projectType || 'Commercial',
                scopeOfWork: scopeOfWork.trim(),
                priority: priority || 'Medium',
                country: country || 'Not Specified',
                timeline: timeline || 'Not Specified',
                projectLinks: projectLinks || [],
                status: 'pending_estimation',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                createdByUid: req.user.uid,
                createdByName: req.user.name,
                changeLog: [{
                    timestamp: new Date().toISOString(),
                    action: 'created',
                    performedByName: req.user.name,
                    details: 'Proposal created'
                }]
            };

            const docRef = await db.collection('proposals').add(newProposal);
            
            // Log activity
            await db.collection('activities').add({
                type: 'proposal_created',
                details: `New proposal created: ${projectName} for ${clientCompany}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: docRef.id,
                projectName,
                clientCompany
            });
            
            // ⚠️⚠️⚠️ CRITICAL: Trigger email notification ⚠️⚠️⚠️
            try {
                console.log('📧 Triggering email for project submission...');
                console.log('👤 User creating proposal:', {
                    name: req.user.name,
                    email: req.user.email,
                    uid: req.user.uid,
                    role: req.user.role
                });
                
                // Verify email exists
                if (!req.user.email) {
                    console.error('❌ CRITICAL: req.user.email is missing!', req.user);
                    throw new Error('User email not available for notification');
                }
                
                const emailPayload = {
                    event: 'project.submitted',
                    data: {
                        projectName: projectName,
                        createdBy: req.user.name,
                        createdByEmail: req.user.email, // ⚠️ THIS SENDS EMAIL TO BDM
                        date: new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        clientName: clientCompany,
                        description: scopeOfWork,
                        projectId: docRef.id
                    }
                };
                
                console.log('📤 Email payload:', JSON.stringify(emailPayload, null, 2));
                
                const emailResponse = await axios.post(
                    `${process.env.API_URL || 'http://localhost:5000'}/api/email/trigger`,
                    emailPayload,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    }
                );
                
                console.log('✅ Email API response:', emailResponse.data);
                console.log('📊 Email sent to', emailResponse.data.recipientCount, 'recipients');
                
            } catch (emailError) {
                console.error('❌ Email notification failed:', emailError.response?.data || emailError.message);
                console.error('❌ Full error:', emailError);
                // Don't fail the whole request if email fails
            }
            
            return res.status(201).json({ 
                success: true, 
                data: { id: docRef.id, ...newProposal },
                message: 'Proposal created successfully'
            });
        }

        // ============================================
        // PUT - Update proposal
        // ============================================
        if (req.method === 'PUT') {
            const { id } = req.query;
            const { action, data } = req.body;
            
            if (!id || !action) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing proposal ID or action' 
                });
            }

            const proposalRef = db.collection('proposals').doc(id);
            const proposalDoc = await proposalRef.get();
            
            if (!proposalDoc.exists) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Proposal not found' 
                });
            }
            
            const proposal = proposalDoc.data();
            
            // BDM isolation
            if (req.user.role === 'bdm' && proposal.createdByUid !== req.user.uid) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Access denied. You can only modify your own proposals.' 
                });
            }
            
            let updates = {};
            let activityDetail = '';

            switch (action) {
                case 'add_links':
                    updates = { 
                        projectLinks: data.links || [],
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetail = `Project links added`;
                    break;
                    
                case 'add_estimation':
                    if (!['estimator', 'coo'].includes(req.user.role)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Estimator or COO can add estimation' 
                        });
                    }
                    
                    updates = {
                        estimation: {
                            manhours: data.manhours || 0,
                            boqUploaded: data.boqUploaded || false,
                            estimatorName: req.user.name,
                            estimatorUid: req.user.uid, // Storing estimator UID
                            estimatedAt: new Date().toISOString(),
                            notes: data.notes || ''
                        },
                        status: 'estimation_complete'
                    };
                    activityDetail = `Estimation completed: ${data.manhours} manhours`;
                    
                    await db.collection('notifications').add({
                        type: 'estimation_complete',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Estimation completed for ${proposal.projectName}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                    
                case 'add_pricing':
                    if (!['coo'].includes(req.user.role)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only COO can add pricing' 
                        });
                    }
                        
                    // Validate required pricing data
                    if (!data.quoteValue || !data.projectNumber) {
                        return res.status(400).json({
                            success: false,
                            error: 'Quote value and project number are required'
                        });
                    }
                        
                    updates = {
                        pricing: {
                            projectNumber: data.projectNumber,
                            quoteValue: data.quoteValue || 0,
                            currency: data.currency || 'USD',
                            hourlyRate: data.hourlyRate || null,
                            profitMargin: data.profitMargin || null,
                            notes: data.notes || '',
                            costBreakdown: data.costBreakdown || null,
                            pricedBy: req.user.name,
                            pricedByUid: req.user.uid,
                            pricedAt: new Date().toISOString()
                        },
                        // CHANGED: Use pending_approval instead of pricing_complete
                        // This ensures Director sees it in the Approve/Reject section
                        status: 'pending_approval'
                    };
                        
                    activityDetail = `Pricing added: ${data.currency} ${data.quoteValue} - Project Number: ${data.projectNumber}`;
                        
                    // Notify BDM that pricing is ready
                    await db.collection('notifications').add({
                        type: 'pricing_complete',
                        recipientUid: proposal.createdByUid,
                        recipientRole: 'bdm',
                        proposalId: id,
                        message: `Pricing ready for ${proposal.projectName} - Project #${data.projectNumber}.`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'normal'
                    });
                        
                    // CHANGED: Notify Director with clearer message about needing approval
                    await db.collection('notifications').add({
                        type: 'pricing_complete_needs_approval',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `COO completed pricing for ${proposal.projectName} - ${data.currency} ${data.quoteValue}. Awaiting your approval.`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;
                    
                case 'submit_to_client':
                    if (req.user.role !== 'bdm' || proposal.createdByUid !== req.user.uid) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only the BDM who created this proposal can submit it' 
                        });
                    }
                    
                    // CHANGED: Check for pending_approval instead of pricing_complete
                    if (proposal.status !== 'pending_approval' && proposal.status !== 'approved') {
                         return res.status(400).json({ 
                             success: false, 
                             error: 'Proposal must have pricing complete or be approved by Director before submission' 
                         });
                    }
                    
                    updates = { status: 'submitted_to_client' };
                    activityDetail = `Proposal submitted to client`;
                    break;

                // ==================================================================
                // == MODIFIED 'mark_won' CASE ==
                // ==================================================================
                case 'mark_won':
                    updates = { 
                        status: 'won',
                        wonDate: data.wonDate || new Date().toISOString(),
                        projectCreated: false,
                        allocationStatus: 'needs_allocation'  // ADDED THIS LINE
                    };
                    activityDetail = `Proposal marked as WON`;
                        
                    // Notify management for allocation
                    await db.collection('notifications').add({
                        type: 'proposal_won_needs_allocation',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `${proposal.projectName} marked as WON by ${proposal.createdByName} - Ready for allocation to Design Manager`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                        
                    await db.collection('notifications').add({
                        type: 'proposal_won_needs_allocation',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `${proposal.projectName} won by ${proposal.createdByName} - Value: ${proposal.pricing?.quoteValue || 'N/A'}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;
                
                // ==================================================================
                // == NEW CASES ADDED HERE ==
                // ==================================================================
                case 'set_project_number':
                    // Only COO can set/modify project number
                    if (req.user.role !== 'coo') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only COO can set project numbers' 
                        });
                    }
                
                    if (!data.projectNumber || !data.projectNumber.trim()) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Project number is required' 
                        });
                    }
                
                    // Check if project number already exists
                    const existingSnapshot = await db.collection('proposals')
                        .where('pricing.projectNumber', '==', data.projectNumber.trim())
                        .get();
                
                    if (!existingSnapshot.empty && existingSnapshot.docs[0].id !== id) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'This project number already exists. Please use a unique number.' 
                        });
                    }
                
                    updates = {
                        'pricing.projectNumber': data.projectNumber.trim(),
                        'pricing.projectNumberStatus': 'pending',
                        'pricing.projectNumberEnteredBy': req.user.name,
                        'pricing.projectNumberEnteredAt': admin.firestore.FieldValue.serverTimestamp()
                    };
                
                    activityDetail = `Project Number set to ${data.projectNumber} by ${req.user.name}`;
                
                    // Notify Director for approval
                    await db.collection('notifications').add({
                        type: 'project_number_pending_approval',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `Project Number ${data.projectNumber} set by ${req.user.name} for "${proposal.projectName}" - Requires your approval`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;
                
                case 'approve_project_number':
                    // Only Director can approve
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Director can approve project numbers' 
                        });
                    }
                
                    if (!proposal.pricing || !proposal.pricing.projectNumber) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'No project number to approve' 
                        });
                    }
                
                    updates = {
                        'pricing.projectNumberStatus': 'approved',
                        'pricing.projectNumberApprovedBy': req.user.name,
                        'pricing.projectNumberApprovedAt': admin.firestore.FieldValue.serverTimestamp()
                    };
                
                    activityDetail = `Project Number ${proposal.pricing.projectNumber} approved by ${req.user.name}`;
                
                    // Notify COO
                    await db.collection('notifications').add({
                        type: 'project_number_approved',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Project Number ${proposal.pricing.projectNumber} for "${proposal.projectName}" has been approved by ${req.user.name}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                
                case 'reject_project_number':
                    // Only Director can reject
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Director can reject project numbers' 
                        });
                    }
                
                    if (!proposal.pricing || !proposal.pricing.projectNumber) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'No project number to reject' 
                        });
                    }
                
                    updates = {
                        'pricing.projectNumberStatus': 'rejected',
                        'pricing.projectNumberRejectionReason': data.reason || 'No reason provided'
                    };
                
                    activityDetail = `Project Number ${proposal.pricing.projectNumber} rejected by ${req.user.name}: ${data.reason}`;
                
                    // Notify COO
                    await db.collection('notifications').add({
                        type: 'project_number_rejected',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Project Number ${proposal.pricing.projectNumber} for "${proposal.projectName}" was rejected by ${req.user.name}. Reason: ${data.reason || 'Not specified'}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;

                // ==================================================================
                // == END OF NEW CASES ==
                // ==================================================================
                    
                case 'mark_lost':
                    updates = { 
                        status: 'lost',
                        lostDate: data.lostDate || new Date().toISOString(),
                        lostReason: data.reason || 'Not specified'
                    };
                    activityDetail = `Proposal marked as LOST: ${data.reason}`;
                    
                    await db.collection('notifications').add({
                        type: 'proposal_lost',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `${proposal.projectName} marked as LOST by ${proposal.createdByName} - Reason: ${data.reason}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                
                // ==================================================================
                // == DIRECTOR APPROVE/REJECT PROPOSAL (NEW CASES) ==
                // ==================================================================
                case 'approve_proposal':
                    // Only Director can approve proposals
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Director can approve proposals' 
                        });
                    }
                    
                    // Can approve proposals in any status before approval
                    const validStatusesForApproval = ['draft', 'estimation_complete', 'pricing_complete', 'pending_approval'];
                    if (!validStatusesForApproval.includes(proposal.status)) {
                        return res.status(400).json({ 
                            success: false, 
                            error: `Cannot approve proposal with status: ${proposal.status}` 
                        });
                    }
                    
                    updates = {
                        status: 'approved',
                        directorApproval: {
                            approved: true,
                            approvedBy: req.user.name,
                            approvedByUid: req.user.uid,
                            approvedAt: admin.firestore.FieldValue.serverTimestamp(),
                            comments: data.comments || ''
                        }
                    };
                    
                    activityDetail = `Proposal approved by Director ${req.user.name}`;
                    
                    // Notify BDM
                    await db.collection('notifications').add({
                        type: 'proposal_approved',
                        recipientUid: proposal.createdByUid,
                        recipientRole: 'bdm',
                        proposalId: id,
                        message: `Your proposal "${proposal.projectName}" has been approved by Director. You can now submit to client.`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    
                    // Notify COO
                    await db.collection('notifications').add({
                        type: 'proposal_approved',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Proposal "${proposal.projectName}" approved by Director ${req.user.name}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;

                case 'reject_proposal':
                    // Only Director can reject proposals
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Director can reject proposals' 
                        });
                    }
                    
                    if (!data.reason || !data.reason.trim()) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Rejection reason is required' 
                        });
                    }
                    
                    updates = {
                        status: 'rejected',
                        directorApproval: {
                            approved: false,
                            rejectedBy: req.user.name,
                            rejectedByUid: req.user.uid,
                            rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
                            reason: data.reason,
                            comments: data.comments || ''
                        }
                    };
                    
                    activityDetail = `Proposal rejected by Director ${req.user.name}: ${data.reason}`;
                    
                    // Notify BDM
                    await db.collection('notifications').add({
                        type: 'proposal_rejected',
                        recipientUid: proposal.createdByUid,
                        recipientRole: 'bdm',
                        proposalId: id,
                        message: `Your proposal "${proposal.projectName}" was rejected by Director. Reason: ${data.reason}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    
                    // Notify COO
                    await db.collection('notifications').add({
                        type: 'proposal_rejected',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Proposal "${proposal.projectName}" rejected by Director ${req.user.name}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    
                    // Notify Estimator if estimation was done
                    if (proposal.estimation && proposal.estimation.estimatorUid) {
                        await db.collection('notifications').add({
                            type: 'proposal_rejected',
                            recipientUid: proposal.estimation.estimatorUid,
                            recipientRole: 'estimator',
                            proposalId: id,
                            message: `Proposal "${proposal.projectName}" was rejected by Director`,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                            isRead: false
                        });
                    }
                    break;
                
                // ==================================================================
                // == REQUEST DIRECTOR APPROVAL (Optional - for explicit workflow) ==
                // ==================================================================
                case 'request_approval':
                    // COO or BDM can request approval
                    if (!['coo', 'bdm'].includes(req.user.role)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only COO or BDM can request approval' 
                        });
                    }
                    
                    // Must have pricing complete
                    if (!proposal.pricing || !proposal.pricing.projectNumber) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Proposal must have pricing and project number before requesting approval' 
                        });
                    }
                    
                    updates = {
                        status: 'pending_approval',
                        approvalRequestedBy: req.user.name,
                        approvalRequestedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    
                    activityDetail = `Approval requested by ${req.user.name}`;
                    
                    // Notify Director
                    await db.collection('notifications').add({
                        type: 'approval_requested',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `${req.user.name} requests your approval for "${proposal.projectName}" - Value: ${proposal.pricing.currency} ${proposal.pricing.quoteValue}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;

                // ============================================
                // == ALLOCATION STATUS TRACKING (NEW CASE) ==
                // ============================================
                case 'update_allocation_status':
                    // Only COO or Director can update allocation status
                    if (!['coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only COO or Director can update allocation status' 
                        });
                    }
                    
                    updates = {
                        allocationStatus: data.allocationStatus || 'allocated',
                        designLeadName: data.designLeadName || null,
                        designLeadUid: data.designLeadUid || null,
                        allocatedAt: data.allocatedAt || admin.firestore.FieldValue.serverTimestamp(),
                        allocatedBy: req.user.name,
                        allocatedByUid: req.user.uid
                    };
                    
                    activityDetail = `Project allocated to Design Manager: ${data.designLeadName}`;
                    break;
                    
                default:
                    return res.status(400).json({ 
                        success: false, 
                        error: 'Invalid action: ' + action 
                    });
            }
            
            // Add change log entry
            updates.changeLog = admin.firestore.FieldValue.arrayUnion({ 
                timestamp: new Date().toISOString(), 
                action: action, 
                performedByName: req.user.name, 
                details: `${action.replace(/_/g, ' ')} completed` 
            });
            updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            
            await proposalRef.update(updates);
            
            // Log activity
            await db.collection('activities').add({
                type: `proposal_${action}`, 
                details: activityDetail, 
                performedByName: req.user.name, 
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(), 
                proposalId: id, 
                projectName: proposal.projectName, 
                clientCompany: proposal.clientCompany
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Proposal updated successfully' 
            });
        }

        // ============================================
        // DELETE - Delete proposal
        // ============================================
        if (req.method === 'DELETE') {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing proposal ID' 
                });
            }

            const proposalRef = db.collection('proposals').doc(id);
            const proposalDoc = await proposalRef.get();
            
            if (!proposalDoc.exists) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Proposal not found' 
                });
            }
            
            const proposalData = proposalDoc.data();
            
            // Security check
            if (proposalData.createdByUid !== req.user.uid && req.user.role !== 'director') {
                return res.status(403).json({ 
                    success: false, 
                    error: 'You are not authorized to delete this proposal.' 
                });
            }

            // Delete associated files
            const filesSnapshot = await db.collection('files').where('proposalId', '==', id).get();
            if (!filesSnapshot.empty) {
                const deletePromises = filesSnapshot.docs.map(doc => {
                    const fileData = doc.data();
                    if (fileData.fileType === 'link') {
                        return doc.ref.delete();
                    }
                    return Promise.all([
                        bucket.file(fileData.fileName).delete().catch(err => {
                            console.warn('File not found in storage:', fileData.fileName);
                        }),
                        doc.ref.delete()
                    ]);
                });
                await Promise.all(deletePromises);
            }

            await proposalRef.delete();
            
            // Log activity
            await db.collection('activities').add({
                type: 'proposal_deleted',
                details: `Proposal deleted: ${proposalData.projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: id
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Proposal and all associated files deleted successfully' 
            });
        }

        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
        
    } catch (error) {
        console.error('Proposals API error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

module.exports = allowCors(handler);
