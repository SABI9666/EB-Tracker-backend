/ api/proposals.js - UPDATED VERSION with new workflow
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
                // Get single proposal - implementation remains same
                const doc = await db.collection('proposals').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }
                
                return res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
            }
            
            // Get all proposals with role-based filtering
            let proposals = [];

            if (req.user.role === 'bdm') {
                const query = db.collection('proposals')
                    .where('createdByUid', '==', req.user.uid)
                    .orderBy('createdAt', 'desc');
                const snapshot = await query.get();
                proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            // ESTIMATOR: See all except Won projects
            else if (req.user.role === 'estimator') {
                const allSnapshot = await db.collection('proposals')
                    .orderBy('createdAt', 'desc')
                    .get();
                
                proposals = allSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(proposal => proposal.status !== 'won');
            }
            // COO: See only new proposals without pricing
            else if (req.user.role === 'coo') {
                const allSnapshot = await db.collection('proposals')
                    .orderBy('createdAt', 'desc')
                    .get();
                
                proposals = allSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(proposal => !proposal.pricing || !proposal.pricing.projectNumber);
            }
            // DIRECTOR: See only proposals pending approval
            else if (req.user.role === 'director') {
                const query = db.collection('proposals')
                    .where('status', '==', 'pending_approval')
                    .orderBy('createdAt', 'desc');
                const snapshot = await query.get();
                proposals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            else {
                // Other roles see all
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
            if (req.user.role !== 'bdm') {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Only BDMs can create proposals' 
                });
            }

            const { projectName, clientCompany, clientContact, projectLocation, projectType, services, description } = req.body;

            if (!projectName || !clientCompany) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Project name and client company are required' 
                });
            }

            const proposalData = {
                projectName,
                clientCompany,
                clientContact: clientContact || null,
                projectLocation: projectLocation || null,
                projectType: projectType || null,
                services: services || [],
                description: description || null,
                status: 'draft',
                createdByName: req.user.name,
                createdByUid: req.user.uid,
                createdByEmail: req.user.email,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                estimationCompleted: false,
                projectCreated: false,
                changeLog: []
            };

            const docRef = await db.collection('proposals').add(proposalData);

            await db.collection('activities').add({
                type: 'proposal_created',
                details: `New proposal created: ${projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: docRef.id,
                projectName: projectName,
                clientCompany: clientCompany
            });

            return res.status(201).json({ 
                success: true, 
                message: 'Proposal created successfully',
                proposalId: docRef.id 
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
                    error: 'Missing required parameters' 
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
            let updates = {};
            let activityDetail = '';

            switch (action) {
                // ESTIMATOR: Update Tonnage and Hours
                case 'update_estimation':
                    if (req.user.role !== 'estimator') {
                        return res.status(403).json({ success: false, error: 'Only estimators can update estimation' });
                    }

                    const { designHours, detailingHours, checkingHours, revisionHours, pmHours, totalHours, tonnage } = data;

                    if ((!totalHours || totalHours === 0) && (!tonnage || tonnage === 0)) {
                        return res.status(400).json({ success: false, error: 'Either Total Hours or Tonnage must be greater than 0' });
                    }

                    updates = {
                        estimation: {
                            designHours: designHours || 0,
                            detailingHours: detailingHours || 0,
                            checkingHours: checkingHours || 0,
                            revisionHours: revisionHours || 0,
                            pmHours: pmHours || 0,
                            totalHours: totalHours || 0,
                            tonnage: tonnage || 0,
                            updatedBy: req.user.name,
                            updatedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        estimationCompleted: true
                    };

                    activityDetail = `Estimation updated: ${totalHours || 0} hours, ${tonnage || 0} tons`;
                    break;

                // COO: Add Pricing and Project Number
                case 'add_pricing':
                    if (req.user.role !== 'coo') {
                        return res.status(403).json({ success: false, error: 'Only COO can add pricing' });
                    }

                    const { projectNumber, quoteValue, currency, pricingNotes } = data;

                    if (!projectNumber || !quoteValue) {
                        return res.status(400).json({ success: false, error: 'Project Number and Quote Value are required' });
                    }

                    updates = {
                        pricing: {
                            projectNumber,
                            quoteValue,
                            currency: currency || 'USD',
                            pricingNotes: pricingNotes || null,
                            addedBy: req.user.name,
                            addedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'pending_approval'
                    };

                    activityDetail = `Pricing added: ${currency || 'USD'} ${quoteValue}, Project #${projectNumber}`;

                    await db.collection('notifications').add({
                        type: 'approval_requested',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `Pricing added for "${proposal.projectName}". Awaiting approval.`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;

                // DIRECTOR: Approve
                case 'approve':
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ success: false, error: 'Only Director can approve' });
                    }

                    if (!data.comment) {
                        return res.status(400).json({ success: false, error: 'Approval comment is required' });
                    }

                    updates = {
                        status: 'approved',
                        directorComment: data.comment,
                        approvedBy: req.user.name,
                        approvedAt: admin.firestore.FieldValue.serverTimestamp()
                    };

                    activityDetail = `Approved: ${data.comment}`;

                    await db.collection('notifications').add({
                        type: 'proposal_approved',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Proposal "${proposal.projectName}" approved. Ready for allocation.`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;

                // DIRECTOR: Reject
                case 'reject':
                    if (req.user.role !== 'director') {
                        return res.status(403).json({ success: false, error: 'Only Director can reject' });
                    }

                    if (!data.comment) {
                        return res.status(400).json({ success: false, error: 'Rejection reason is required' });
                    }

                    updates = {
                        status: 'rejected',
                        directorComment: data.comment,
                        rejectedBy: req.user.name,
                        rejectedAt: admin.firestore.FieldValue.serverTimestamp()
                    };

                    activityDetail = `Rejected: ${data.comment}`;

                    if (proposal.createdByUid) {
                        await db.collection('notifications').add({
                            type: 'proposal_rejected',
                            recipientUid: proposal.createdByUid,
                            proposalId: id,
                            message: `Proposal "${proposal.projectName}" rejected: ${data.comment}`,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                            isRead: false,
                            priority: 'high'
                        });
                    }
                    break;

                default:
                    return res.status(400).json({ success: false, error: 'Invalid action' });
            }

            updates.changeLog = admin.firestore.FieldValue.arrayUnion({ 
                timestamp: new Date().toISOString(), 
                action: action, 
                performedByName: req.user.name, 
                details: activityDetail
            });
            updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            
            await proposalRef.update(updates);
            
            await db.collection('activities').add({
                type: `proposal_${action}`, 
                details: activityDetail, 
                performedByName: req.user.name, 
                performedByRole: req.user.role,
                timestamp: admin.firestore.FieldValue.serverTimestamp(), 
                proposalId: id, 
                projectName: proposal.projectName
            });
            
            return res.status(200).json({ success: true, message: 'Proposal updated successfully' });
        }

        // ============================================
        // DELETE - Delete proposal
        // ============================================
        if (req.method === 'DELETE') {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Missing proposal ID' });
            }

            const proposalRef = db.collection('proposals').doc(id);
            const proposalDoc = await proposalRef.get();
            
            if (!proposalDoc.exists) {
                return res.status(404).json({ success: false, error: 'Proposal not found' });
            }
            
            const proposalData = proposalDoc.data();
            
            if (proposalData.createdByUid !== req.user.uid && req.user.role !== 'director') {
                return res.status(403).json({ success: false, error: 'Unauthorized' });
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
                        bucket.file(fileData.fileName).delete().catch(err => console.warn('File not found:', fileData.fileName)),
                        doc.ref.delete()
                    ]);
                });
                await Promise.all(deletePromises);
            }

            await proposalRef.delete();
            
            await db.collection('activities').add({
                type: 'proposal_deleted',
                details: `Proposal deleted: ${proposalData.projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: id
            });
            
            return res.status(200).json({ success: true, message: 'Proposal deleted successfully' });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });
        
    } catch (error) {
        console.error('Proposals API error:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error', message: error.message });
    }
};

module.exports = allowCors(handler);
