// api/proposals.js - COMPLETE UPDATED VERSION with index32 workflow
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

        // ===== GET REQUEST - FETCH PROPOSALS =====
        if (req.method === 'GET') {
            const { id } = req.query;
            
            if (id) {
                const doc = await db.collection('proposals').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }
                return res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
            }
            
            let proposals = [];

            // Role-based queries matching index32 workflow
            if (req.user.role === 'bdm') {
                // BDM sees only their own proposals
                const query = db.collection('proposals')
                    .where('createdByUid', '==', req.user.uid)
                    .orderBy('createdAt', 'desc');
                const snapshot = await query.get();
                proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            else if (req.user.role === 'estimator') {
                // Estimator sees proposals needing estimation or revision
                const allSnapshot = await db.collection('proposals')
                    .orderBy('createdAt', 'desc')
                    .get();
                proposals = allSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(proposal => 
                        proposal.status === 'pending_estimation' || 
                        (proposal.status === 'revision_required' && 
                         proposal.directorApproval?.requiresRevisionBy === 'estimator')
                    );
            }
            else if (req.user.role === 'coo') {
                // COO sees proposals needing pricing
                const allSnapshot = await db.collection('proposals')
                    .orderBy('createdAt', 'desc')
                    .get();
                proposals = allSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(proposal => proposal.status === 'pending_pricing');
            }
            else if (req.user.role === 'director') {
                // Director sees proposals needing approval
                const allSnapshot = await db.collection('proposals')
                    .orderBy('createdAt', 'desc')
                    .get();
                proposals = allSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(proposal => proposal.status === 'pending_director_approval');
            }
            else {
                // Admin or other roles see all
                const query = db.collection('proposals').orderBy('createdAt', 'desc');
                const snapshot = await query.get();
                proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            
            return res.status(200).json({ success: true, data: proposals });
        }

        // ===== POST REQUEST - CREATE PROPOSAL =====
        if (req.method === 'POST') {
            if (req.user.role !== 'bdm') {
                return res.status(403).json({ success: false, error: 'Only BDMs can create proposals' });
            }

            const proposalData = {
                ...req.body,
                status: 'pending_estimation', // Initial status in new workflow
                createdByName: req.user.name,
                createdByUid: req.user.uid,
                createdByEmail: req.user.email,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('proposals').add(proposalData);

            // Log activity
            await db.collection('activities').add({
                type: 'proposal_created',
                proposalId: docRef.id,
                details: `Proposal "${req.body.projectName}" created by ${req.user.name}`,
                performedBy: req.user.uid,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({ 
                success: true, 
                message: 'Proposal created successfully',
                data: { id: docRef.id, ...proposalData }
            });
        }

        // ===== PUT REQUEST - UPDATE PROPOSAL =====
        if (req.method === 'PUT') {
            const { id } = req.query;
            const { action, data } = req.body;

            if (!id) {
                return res.status(400).json({ success: false, error: 'Proposal ID required' });
            }

            const proposalRef = db.collection('proposals').doc(id);
            const doc = await proposalRef.get();

            if (!doc.exists) {
                return res.status(404).json({ success: false, error: 'Proposal not found' });
            }

            const proposal = doc.data();
            let updateData = {};
            let activityDetails = '';

            // Handle different actions based on index32 workflow
            switch (action) {
                case 'add_estimation':
                    if (req.user.role !== 'estimator') {
                        return res.status(403).json({ success: false, error: 'Only estimators can add estimation' });
                    }
                    updateData = {
                        estimation: {
                            ...data,
                            estimatedBy: req.user.name,
                            estimatedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'pending_pricing',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `Estimation added by ${req.user.name}`;
                    break;

                case 'set_pricing':
                    if (req.user.role !== 'coo') {
                        return res.status(403).json({ success: false, error: 'Only COO can set pricing' });
                    }
                    updateData = {
                        pricing: {
                            ...data,
                            pricedBy: req.user.name,
                            pricedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'pending_director_approval',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `Pricing set by ${req.user.name} - Quote: ${data.quoteValue} ${data.currency}`;
                    break;

                case 'director_approve':
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ success: false, error: 'Only director can approve' });
                    }
                    updateData = {
                        directorApproval: {
                            approved: true,
                            comments: data.comments || '',
                            approvedBy: req.user.name,
                            approvedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'approved',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `Proposal approved by ${req.user.name}`;
                    if (data.comments) {
                        activityDetails += ` - Comments: ${data.comments}`;
                    }
                    break;

                case 'director_reject':
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ success: false, error: 'Only director can reject' });
                    }
                    updateData = {
                        directorApproval: {
                            approved: false,
                            comments: data.comments || '',
                            requiresRevisionBy: data.requiresRevisionBy || 'estimator',
                            rejectedBy: req.user.name,
                            rejectedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'revision_required',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `Revision requested by ${req.user.name} - Assigned to: ${data.requiresRevisionBy} - Reason: ${data.comments}`;
                    break;

                case 'submit_to_client':
                    if (req.user.role !== 'bdm') {
                        return res.status(403).json({ success: false, error: 'Only BDM can submit to client' });
                    }
                    updateData = {
                        clientSubmission: {
                            method: data.method || 'Email',
                            submittedBy: req.user.name,
                            submittedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'submitted_to_client',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `Proposal submitted to client by ${req.user.name} via ${data.method}`;
                    break;

                case 'mark_job_won':
                    if (req.user.role !== 'bdm') {
                        return res.status(403).json({ success: false, error: 'Only BDM can mark job won' });
                    }
                    updateData = {
                        jobOutcome: {
                            outcome: 'won',
                            markedBy: req.user.name,
                            markedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'won',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `🎉 Job marked as WON by ${req.user.name}`;
                    break;

                case 'mark_job_lost':
                    if (req.user.role !== 'bdm') {
                        return res.status(403).json({ success: false, error: 'Only BDM can mark job lost' });
                    }
                    updateData = {
                        jobOutcome: {
                            outcome: 'lost',
                            reason: data.reason || '',
                            markedBy: req.user.name,
                            markedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'lost',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `Job marked as LOST by ${req.user.name}`;
                    if (data.reason) {
                        activityDetails += ` - Reason: ${data.reason}`;
                    }
                    break;

                case 'edit_proposal':
                    // Allow BDM to edit their own proposals in certain statuses
                    if (req.user.role !== 'bdm' || proposal.createdByUid !== req.user.uid) {
                        return res.status(403).json({ success: false, error: 'Only the proposal creator can edit' });
                    }
                    updateData = {
                        ...data,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetails = `Proposal edited by ${req.user.name}`;
                    break;

                default:
                    return res.status(400).json({ success: false, error: 'Invalid action' });
            }

            // Update the proposal
            await proposalRef.update(updateData);

            // Log activity
            if (activityDetails) {
                await db.collection('activities').add({
                    type: 'proposal_update',
                    proposalId: id,
                    action: action,
                    details: activityDetails,
                    performedBy: req.user.uid,
                    performedByName: req.user.name,
                    performedByRole: req.user.role,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            }

            return res.status(200).json({ 
                success: true, 
                message: 'Proposal updated successfully',
                data: { id, ...updateData }
            });
        }

        // ===== DELETE REQUEST - DELETE PROPOSAL =====
        if (req.method === 'DELETE') {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ success: false, error: 'Proposal ID required' });
            }

            const proposalRef = db.collection('proposals').doc(id);
            const doc = await proposalRef.get();

            if (!doc.exists) {
                return res.status(404).json({ success: false, error: 'Proposal not found' });
            }

            const proposal = doc.data();

            // Check permissions
            const canDelete = req.user.role === 'director' || 
                            (req.user.role === 'bdm' && 
                             proposal.createdByUid === req.user.uid && 
                             ['pending_estimation', 'revision_required'].includes(proposal.status));

            if (!canDelete) {
                return res.status(403).json({ success: false, error: 'Permission denied to delete this proposal' });
            }

            // Delete associated files from storage
            try {
                const filesSnapshot = await db.collection('files')
                    .where('proposalId', '==', id)
                    .get();

                const deletePromises = filesSnapshot.docs.map(async (fileDoc) => {
                    const fileData = fileDoc.data();
                    if (fileData.storagePath) {
                        try {
                            await bucket.file(fileData.storagePath).delete();
                        } catch (err) {
                            console.error(`Error deleting file ${fileData.storagePath}:`, err);
                        }
                    }
                    await fileDoc.ref.delete();
                });

                await Promise.all(deletePromises);
            } catch (err) {
                console.error('Error deleting associated files:', err);
            }

            // Delete the proposal
            await proposalRef.delete();

            // Log activity
            await db.collection('activities').add({
                type: 'proposal_deleted',
                proposalId: id,
                details: `Proposal "${proposal.projectName}" deleted by ${req.user.name}`,
                performedBy: req.user.uid,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({ 
                success: true, 
                message: 'Proposal and associated files deleted successfully' 
            });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });

    } catch (error) {
        console.error('Error in proposals handler:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error', 
            details: error.message 
        });
    }
};

module.exports = allowCors(handler);
