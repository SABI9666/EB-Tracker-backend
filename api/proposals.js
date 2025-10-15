// api/proposals.js - Complete Proposals API Handler
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');

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

        // FIX: Manually parse JSON body for POST/PUT requests if the server environment hasn't.
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
                
                // BDM isolation: Check if BDM can access this proposal
                if (req.user.role === 'bdm' && proposalData.createdByUid !== req.user.uid) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Access denied. You can only view your own proposals.' 
                    });
                }
                
                return res.status(200).json({ success: true, data: { id: doc.id, ...proposalData } });
            }
            
            // Get all proposals with BDM isolation
            let query = db.collection('proposals').orderBy('createdAt', 'desc');
            
            // BDMs only see their own proposals
            if (req.user.role === 'bdm') {
                query = query.where('createdByUid', '==', req.user.uid);
            }
            
            const snapshot = await query.get();
            const proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            
            // Return new proposal with its ID for file linking on frontend
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
            
            // BDM isolation: Check if BDM can modify this proposal
            if (req.user.role === 'bdm' && proposal.createdByUid !== req.user.uid) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Access denied. You can only modify your own proposals.' 
                });
            }
            
            let updates = {};
            let activityDetail = '';

            // ============================================
            // Handle different actions
            // ============================================
            switch (action) {
                case 'add_links':
                    updates = { 
                        projectLinks: data.links || [],
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetail = `Added ${data.links?.length || 0} project links`;
                    break;
                    
                case 'add_estimation':
                    // Only estimators can add estimation
                    if (req.user.role !== 'estimator') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only estimators can add estimation' 
                        });
                    }
                    
                    updates = { 
                        status: 'pending_pricing',
                        estimation: { 
                            ...data, 
                            estimatedBy: req.user.name, 
                            estimatedAt: new Date().toISOString() 
                        }
                    };
                    activityDetail = `Estimation added: ${data.totalHours} hours`;
                    
                    // Notify COO
                    await db.collection('notifications').add({
                        type: 'estimation_completed',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Estimation completed for ${proposal.projectName} - ${data.totalHours} hours`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                    
                case 'set_pricing':
                    // Only COO can set pricing
                    if (req.user.role !== 'coo') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only COO can set pricing' 
                        });
                    }
                    
                    updates = { 
                        status: 'pending_director_approval',
                        pricing: { 
                            ...data, 
                            pricedBy: req.user.name, 
                            pricedAt: new Date().toISOString() 
                        }
                    };
                    
                    // If COO updated the services, apply the change
                    if (data.updatedServices) {
                        updates['estimation.services'] = data.updatedServices;
                    }
                    
                    activityDetail = `Pricing set: ${data.currency || 'USD'} ${data.quoteValue}`;
                    
                    // Notify Director
                    await db.collection('notifications').add({
                        type: 'pricing_set',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `Pricing set for ${proposal.projectName} - Awaiting approval`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                    
                case 'director_approve':
                    // Only director can approve
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Director can approve proposals' 
                        });
                    }
                    
                    updates = { 
                        status: 'approved', 
                        directorApproval: { 
                            approved: true, 
                            ...data, 
                            approvedBy: req.user.name, 
                            approvedAt: new Date().toISOString(),
                            comments: data.comments || ''
                        } 
                    };
                    activityDetail = `Director approved proposal${data.comments ? ': ' + data.comments : ''}`;
                    
                    // Notify stakeholders
                    const stakeholders = ['bdm', 'estimator', 'coo'];
                    for (const role of stakeholders) {
                        await db.collection('notifications').add({
                            type: 'proposal_approved',
                            recipientRole: role,
                            recipientUid: role === 'bdm' ? proposal.createdByUid : null,
                            proposalId: id,
                            message: `${proposal.projectName} has been approved by Director`,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                            isRead: false
                        });
                    }
                    break;
                    
                case 'director_reject':
                    // Only director can reject
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Director can reject proposals' 
                        });
                    }
                    
                    updates = { 
                        status: 'revision_required',
                        directorApproval: { 
                            approved: false, 
                            ...data, 
                            rejectedBy: req.user.name, 
                            rejectedAt: new Date().toISOString(),
                            comments: data.comments || '',
                            requiresRevisionBy: data.requiresRevisionBy || 'estimator'
                        } 
                    };
                    activityDetail = `Director requested revision: ${data.comments}`;
                    
                    // Notify the person who needs to revise
                    await db.collection('notifications').add({
                        type: 'revision_required',
                        recipientRole: data.requiresRevisionBy,
                        recipientUid: data.requiresRevisionBy === 'bdm' ? proposal.createdByUid : null,
                        proposalId: id,
                        message: `Revision required for ${proposal.projectName}: ${data.comments}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                    
                case 'resubmit_after_revision':
                    updates = {
                        status: 'pending_director_approval',
                        revisionHistory: admin.firestore.FieldValue.arrayUnion({
                            revisedBy: req.user.name,
                            revisedAt: new Date().toISOString(),
                            revisionNotes: data.notes
                        })
                    };
                    activityDetail = `Revision completed and resubmitted by ${req.user.name}`;
                    break;
                    
                case 'submit_to_client':
                    // Only BDM can submit to client
                    if (req.user.role !== 'bdm') {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only BDM can submit to client' 
                        });
                    }
                    
                    updates = { status: 'submitted_to_client' };
                    activityDetail = `Proposal submitted to client`;
                    break;
                    
                case 'mark_won':
                    updates = { 
                        status: 'won',
                        wonDate: data.wonDate || new Date().toISOString(),
                        projectCreated: false
                    };
                    activityDetail = `Proposal marked as WON`;
                    
                    // Notify management
                    await db.collection('notifications').add({
                        type: 'proposal_won',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `${proposal.projectName} marked as WON - Ready for allocation to Design Manager`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    
                    await db.collection('notifications').add({
                        type: 'proposal_won',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `${proposal.projectName} won by ${proposal.createdByName} - Value: ${proposal.pricing?.quoteValue || 'N/A'}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    
                    await db.collection('notifications').add({
                        type: 'proposal_won',
                        recipientRole: 'design_lead',
                        proposalId: id,
                        message: `New won proposal: ${proposal.projectName} - Awaiting COO allocation`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                    
                case 'mark_lost':
                    updates = { 
                        status: 'lost',
                        lostDate: data.lostDate || new Date().toISOString(),
                        lostReason: data.reason || 'Not specified'
                    };
                    activityDetail = `Proposal marked as LOST: ${data.reason}`;
                    
                    // Notify Director for reporting
                    await db.collection('notifications').add({
                        type: 'proposal_lost',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `${proposal.projectName} marked as LOST by ${proposal.createdByName} - Reason: ${data.reason}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
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
            
            // Update the proposal
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
            
            // Security check: Only creator or a director can delete
            if (proposalData.createdByUid !== req.user.uid && req.user.role !== 'director') {
                return res.status(403).json({ 
                    success: false, 
                    error: 'You are not authorized to delete this proposal.' 
                });
            }

            // Delete associated files from storage and Firestore
            const filesSnapshot = await db.collection('files').where('proposalId', '==', id).get();
            if (!filesSnapshot.empty) {
                const deletePromises = filesSnapshot.docs.map(doc => {
                    const fileData = doc.data();
                    // Skip deletion for link-type files (they don't have physical storage)
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

            // Delete the proposal document
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

        // ============================================
        // Method not allowed
        // ============================================
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
