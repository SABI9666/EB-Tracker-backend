// api/projects.js - Complete projects handler
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

        if (req.method === 'GET') {
            const { id } = req.query;
            
            if (id) {
                const doc = await db.collection('projects').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Project not found' });
                }
                return res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
            }
            
            let query = db.collection('projects').orderBy('createdAt', 'desc');
            const snapshot = await query.get();
            const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            return res.status(200).json({ success: true, data: projects });
        }

        if (req.method === 'POST') {
            const { action } = req.query;
            
            if (action === 'create_from_proposal') {
                const { proposalId } = req.body;
                
                if (!proposalId) {
                    return res.status(400).json({ success: false, error: 'Missing proposalId' });
                }
                
                const proposalDoc = await db.collection('proposals').doc(proposalId).get();
                if (!proposalDoc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }
                
                const proposal = proposalDoc.data();
                
                const projectData = {
                    projectCode: `PRJ-${Date.now()}`,
                    projectName: proposal.projectName,
                    clientCompany: proposal.clientCompany,
                    scopeOfWork: proposal.scopeOfWork,
                    quoteValue: proposal.pricing?.quoteValue || 0,
                    currency: proposal.pricing?.currency || 'USD',
                    status: 'pending_setup',
                    designStatus: 'not_started',
                    proposalId: proposalId,
                    bdmName: proposal.createdByName,
                    bdmUid: proposal.createdByUid,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdBy: req.user.name,
                    createdByUid: req.user.uid
                };
                
                const docRef = await db.collection('projects').add(projectData);
                
                // Mark proposal as having project created
                await db.collection('proposals').doc(proposalId).update({
                    projectCreated: true,
                    projectId: docRef.id
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
                
                return res.status(201).json({ 
                    success: true, 
                    data: { id: docRef.id, ...projectData },
                    message: 'Project created successfully'
                });
            }
            
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }

        if (req.method === 'PUT') {
            const { id } = req.query;
            const updates = req.body;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Missing project ID' });
            }
            
            const projectRef = db.collection('projects').doc(id);
            const projectDoc = await projectRef.get();
            
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
            
            updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            await projectRef.update(updates);
            
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
