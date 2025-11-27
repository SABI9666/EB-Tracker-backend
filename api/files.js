// api/files.js
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const multer = require('multer');

const db = admin.firestore();
const bucket = admin.storage().bucket();

// 1. CRITICAL: Disable default body parser so Multer can read the file stream
// This is required for Next.js / Vercel serverless functions
export const config = {
    api: {
        bodyParser: false,
    },
};

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB limit (Adjust as needed, keeping it reasonable for serverless)
    }
});

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

// --- HELPER FUNCTIONS ---

async function canAccessFile(file, userRole, userUid, proposalId = null) {
    // 1. Management & Estimators see everything
    if (['coo', 'director', 'estimator'].includes(userRole)) return true;

    let proposal = null;
    const pId = file.proposalId || proposalId;

    if (pId) {
        const proposalDoc = await db.collection('proposals').doc(pId).get();
        if (proposalDoc.exists) proposal = proposalDoc.data();
    }
    
    // 2. BDM Access: Can only see their own proposals
    if (userRole === 'bdm') {
        // If file belongs to a proposal, check BDM ownership
        if (proposal) return proposal.createdByUid === userUid;
        // If file is orphaned but uploaded by this BDM
        return file.uploadedByUid === userUid;
    }

    // 3. Designer/Lead Access
    if (['design_lead', 'designer'].includes(userRole)) {
        // Can access Project, Drawing, and Spec files
        if (!file.fileType || ['project', 'drawing', 'specification', 'link'].includes(file.fileType)) {
            // In a real strict app, you'd check if they are assigned to this project
            // For now, allow access if it's a project file
            return true; 
        }
        return false; // Cannot access estimation/pricing files
    }

    return false;
}

const handler = async (req, res) => {
    try {
        // ============================================
        // POST - UPLOAD FILE (Multipart/Form-Data)
        // ============================================
        // Updated check: uses query param ?action=upload
        if (req.method === 'POST' && req.query.action === 'upload') {
            
            // Run Multer Middleware
            await util.promisify(upload.single('file'))(req, res);

            // Run Auth Middleware (After multer, because multer handles the raw stream)
            try {
                await util.promisify(verifyToken)(req, res);
            } catch (authError) {
                return res.status(401).json({ success: false, error: 'Authentication failed' });
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json({ success: false, error: 'No file uploaded' });
            }

            // Extract text fields from body (Multer parses these too)
            const proposalId = req.body.proposalId === 'null' || req.body.proposalId === '' ? null : req.body.proposalId;
            const fileType = req.body.fileType || 'project';

            // Check permissions
            if (req.user.role === 'bdm' && proposalId) {
                const pDoc = await db.collection('proposals').doc(proposalId).get();
                if (!pDoc.exists || pDoc.data().createdByUid !== req.user.uid) {
                    return res.status(403).json({ success: false, error: 'Access denied to this proposal' });
                }
            }

            // Upload to Firebase Storage
            const storagePath = `${proposalId || 'general'}/${Date.now()}-${file.originalname}`;
            const fileRef = bucket.file(storagePath);

            await fileRef.save(file.buffer, {
                contentType: file.mimetype,
                metadata: { contentType: file.mimetype }
            });

            // Save Metadata to Firestore
            // Note: We don't generate a public URL here. We generate a Signed URL on GET.
            const fileData = {
                storagePath: storagePath, // Save path for generating signed URLs later
                originalName: file.originalname,
                mimeType: file.mimetype,
                fileSize: file.size,
                proposalId: proposalId,
                fileType: fileType,
                uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                uploadedByUid: req.user.uid,
                uploadedByName: req.user.name,
                uploadedByRole: req.user.role
            };

            const docRef = await db.collection('files').add(fileData);

            // Log activity
            await db.collection('activities').add({
                type: 'file_uploaded',
                details: `File uploaded: ${file.originalname}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: proposalId
            });

            return res.status(201).json({ success: true, data: { id: docRef.id, ...fileData } });
        }

        // ============================================
        // AUTHENTICATE FOR OTHER ENDPOINTS (JSON)
        // ============================================
        await util.promisify(verifyToken)(req, res);

        // ============================================
        // GET - RETRIEVE FILES (Generates Signed URLs)
        // ============================================
        if (req.method === 'GET') {
            const { proposalId, fileId, projectId } = req.query;
            let query = db.collection('files').orderBy('uploadedAt', 'desc');

            if (fileId) {
                const doc = await db.collection('files').doc(fileId).get();
                if (!doc.exists) return res.status(404).json({ success: false, error: 'File not found' });
                const data = doc.data();
                
                // Permission Check
                if (!await canAccessFile(data, req.user.role, req.user.uid)) {
                    return res.status(403).json({ success: false, error: 'Access denied' });
                }

                // Generate Signed URL (Valid for 1 hour)
                let signedUrl = data.url; // Fallback to old url if exists
                if (data.storagePath) {
                    const [url] = await bucket.file(data.storagePath).getSignedUrl({
                        action: 'read',
                        expires: Date.now() + 60 * 60 * 1000, // 1 hour
                    });
                    signedUrl = url;
                }

                return res.status(200).json({ success: true, data: { ...data, id: doc.id, url: signedUrl } });
            }

            // List Filter
            if (proposalId) query = query.where('proposalId', '==', proposalId);
            else if (projectId) query = query.where('projectId', '==', projectId); // If you store projectId on files

            const snapshot = await query.get();
            
            // Filter and Generate URLs in parallel
            const filePromises = snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const hasAccess = await canAccessFile(data, req.user.role, req.user.uid);
                
                if (!hasAccess) return null;

                // Generate Signed URL
                let signedUrl = data.url;
                if (data.storagePath && data.fileType !== 'link') {
                    try {
                        const [url] = await bucket.file(data.storagePath).getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 60 * 60 * 1000, // 1 hour
                        });
                        signedUrl = url;
                    } catch (e) {
                        console.error(`Error signing URL for ${data.storagePath}:`, e);
                    }
                }

                return { 
                    id: doc.id, 
                    ...data, 
                    url: signedUrl,
                    canDelete: data.uploadedByUid === req.user.uid || req.user.role === 'director' 
                };
            });

            const files = (await Promise.all(filePromises)).filter(f => f !== null);
            return res.status(200).json({ success: true, data: files });
        }

        // ============================================
        // DELETE
        // ============================================
        if (req.method === 'DELETE') {
            const { id } = req.query;
            const doc = await db.collection('files').doc(id).get();
            if (!doc.exists) return res.status(404).json({ success: false });
            
            const data = doc.data();
            if (data.uploadedByUid !== req.user.uid && req.user.role !== 'director') {
                return res.status(403).json({ success: false, error: 'Permission denied' });
            }

            if (data.storagePath) {
                await bucket.file(data.storagePath).delete().catch(e => console.log('Storage delete error:', e.message));
            }
            await db.collection('files').doc(id).delete();
            
            return res.status(200).json({ success: true });
        }

        // ============================================
        // POST - ADD LINKS (JSON Body)
        // ============================================
        if (req.method === 'POST') {
            // Logic for links (JSON body) remains separate from file upload
            const { links, proposalId } = req.body;
            if (links && Array.isArray(links)) {
                // ... (Keep your existing link saving logic) ...
                const batch = db.batch();
                links.forEach(link => {
                    const ref = db.collection('files').doc();
                    batch.set(ref, {
                        ...link,
                        proposalId,
                        fileType: 'link',
                        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                        uploadedByUid: req.user.uid
                    });
                });
                await batch.commit();
                return res.status(201).json({ success: true });
            }
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });

    } catch (error) {
        console.error('Files API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = allowCors(handler);
