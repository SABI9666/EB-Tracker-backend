// api/variations.js - Handles creation of new variations
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
        // POST - Create a new variation for approval
        // ============================================
        if (req.method === 'POST') {
            // Only Design Leads can create variations
            if (req.user.role !== 'design_lead') {
                return res.status(403).json({ success: false, error: 'Only Design Leads can submit variations.' });
            }

            const {
                parentProjectId,
                variationCode,
                estimatedHours,
                scopeDescription
            } = req.body;

            // --- Validation ---
            if (!parentProjectId || !variationCode || !estimatedHours || !scopeDescription) {
                return res.status(400).json({ success: false, error: 'Missing required fields.' });
            }

            // Get parent project for context
            const projectDoc = await db.collection('projects').doc(parentProjectId).get();
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Parent project not found.' });
            }
            const project = projectDoc.data();

            // Check for duplicate variation code
            const existingVariation = await db.collection('variations')
                .where('parentProjectId', '==', parentProjectId)
                .where('variationCode', '==', variationCode)
                .get();

            if (!existingVariation.empty) {
                return res.status(400).json({ success: false, error: 'This Variation Code already exists for this project.' });
            }

            // --- Create Variation Document ---
            const variationData = {
                parentProjectId: parentProjectId,
                parentProjectName: project.projectName,
                parentProjectCode: project.projectCode,
                clientCompany: project.clientCompany,
                
                variationCode: variationCode,
                estimatedHours: parseFloat(estimatedHours),
                scopeDescription: scopeDescription,
                
                status: 'pending_coo_approval',
                
                createdByUid: req.user.uid,
                createdByName: req.user.name,
                createdByRole: req.user.role,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const variationRef = await db.collection('variations').add(sanitizeForFirestore(variationData));

            // --- Log Activity ---
            await db.collection('activities').add({
                type: 'variation_created',
                details: `Variation "${variationCode}" (${estimatedHours}h) submitted for approval by ${req.user.name}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: parentProjectId,
                variationId: variationRef.id
            });

            // --- Notify all COOs ---
            const cooSnapshot = await db.collection('users').where('role', '==', 'coo').get();
            const notifications = [];
            
            cooSnapshot.forEach(doc => {
                notifications.push(db.collection('notifications').add({
                    type: 'variation_pending_approval',
                    recipientUid: doc.id,
                    recipientRole: 'coo',
                    message: `New variation "${variationCode}" for ${project.projectName} requires approval.`,
                    projectId: parentProjectId,
                    variationId: variationRef.id,
                    estimatedHours: parseFloat(estimatedHours),
                    submittedBy: req.user.name,
                    priority: 'high',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false
                }));
            });
            
            await Promise.all(notifications);

            return res.status(200).json({ success: true, message: 'Variation submitted for approval.', variationId: variationRef.id });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });

    } catch (error) {
        console.error('Variations API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

module.exports = allowCors(handler);
