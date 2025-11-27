// api/files.js - FIXED: CommonJS syntax for Node.js/Render
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const multer = require('multer');

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB limit
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
        if (proposal) return proposal.createdByUid === userUid;
        return file.uploadedByUid === userUid;
    }

    // 3. Designer/Lead Access
    if (['design_lead', 'designer'].includes(userRole)) {
        if (!file.fileType || ['project', 'drawing', 'specification', 'link'].includes(file.fileType)) {
            return true; 
        }
        return false;
    }

    return false;
}

// Helper to run multer as promise
function runMulter(req, res) {
    return new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

const handler = async (req, res) => {
    try {
        // ============================================
        // POST - UPLOAD FILE (Multipart/Form-Data)
        // ============================================
        if (req.method === 'POST' && (req.query.action === 'upload' || req.url.includes('upload-file'))) {
            
            // Run Multer Middleware to parse multipart form data
            try {
                await runMulter(req, res);
            } catch (multerError) {
                console.error('Multer error:', multerError);
                return res.status(400).json({ success: false, error: 'File upload error: ' + multerError.message });
            }

            // Run Auth Middleware
            try {
                await util.promisify(verifyToken)(req, res);
            } catch (authError) {
                return res.status(401).json({ success: false, error: 'Authentication failed' });
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json({ success: false, error: 'No file uploaded' });
            }

            console.log(`📤 Uploading file: ${file.originalname} (${file.size} bytes)`);

            // Extract text fields from body
            const proposalId = req.body.proposalId === 'null' || req.body.proposalId === '' ? null : req.body.proposalId;
            const projectId = req.body.projectId === 'null' || req.body.projectId === '' ? null : req.body.projectId;
            const fileType = req.body.fileType || 'project';

            // Check permissions for BDM
            if (req.user.role === 'bdm' && proposalId) {
                const pDoc = await db.collection('proposals').doc(proposalId).get();
                if (!pDoc.exists || pDoc.data().createdByUid !== req.user.uid) {
                    return res.status(403).json({ success: false, error: 'Access denied to this proposal' });
                }
            }

            // Upload to Firebase Storage
            const folder = proposalId || projectId || 'general';
            const storagePath = `${folder}/${Date.now()}-${file.originalname}`;
            const fileRef = bucket.file(storagePath);

            await fileRef.save(file.buffer, {
                contentType: file.mimetype,
                metadata: { contentType: file.mimetype }
            });

            // Make file publicly accessible (alternative to signed URLs)
            await fileRef.makePublic().catch(e => console.log('Note: Could not make file public:', e.message));

            // Get public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

            // Save Metadata to Firestore
            const fileData = {
                storagePath: storagePath,
                fileName: file.originalname,
                originalName: file.originalname,
                mimeType: file.mimetype,
                fileSize: file.size,
                proposalId: proposalId,
                projectId: projectId,
                fileType: fileType,
                url: publicUrl,
                fileUrl: publicUrl,
                uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                uploadedByUid: req.user.uid,
                uploadedByName: req.user.name,
                uploadedByRole: req.user.role
            };

            const docRef = await db.collection('files').add(fileData);

            console.log(`✅ File uploaded successfully: ${file.originalname}`);

            // Log activity
            await db.collection('activities').add({
                type: 'file_uploaded',
                details: `File uploaded: ${file.originalname}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: proposalId,
                projectId: projectId
            });

            return res.status(201).json({ 
                success: true, 
                data: { 
                    id: docRef.id, 
                    ...fileData,
                    url: publicUrl,
                    fileUrl: publicUrl
                } 
            });
        }

        // ============================================
        // AUTHENTICATE FOR OTHER ENDPOINTS
        // ============================================
        await util.promisify(verifyToken)(req, res);

        // ============================================
        // GET - RETRIEVE FILES
        // ============================================
        if (req.method === 'GET') {
            const { proposalId, fileId, projectId, id } = req.query;
            
            // Single file by ID
            if (fileId || id) {
                const docId = fileId || id;
                const doc = await db.collection('files').doc(docId).get();
                if (!doc.exists) return res.status(404).json({ success: false, error: 'File not found' });
                
                const data = doc.data();
                
                if (!await canAccessFile(data, req.user.role, req.user.uid)) {
                    return res.status(403).json({ success: false, error: 'Access denied' });
                }

                // Generate Signed URL if no public URL
                let fileUrl = data.url || data.fileUrl;
                if (!fileUrl && data.storagePath) {
                    try {
                        const [url] = await bucket.file(data.storagePath).getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 60 * 60 * 1000,
                        });
                        fileUrl = url;
                    } catch (e) {
                        console.error('Error generating signed URL:', e);
                    }
                }

                return res.status(200).json({ 
                    success: true, 
                    data: { 
                        ...data, 
                        id: doc.id, 
                        url: fileUrl,
                        fileUrl: fileUrl
                    } 
                });
            }

            // List files
            let query = db.collection('files').orderBy('uploadedAt', 'desc');

            if (proposalId) {
                query = query.where('proposalId', '==', proposalId);
            } else if (projectId) {
                query = query.where('projectId', '==', projectId);
            }

            const snapshot = await query.get();
            
            // Filter and process files
            const filePromises = snapshot.docs.map(async (doc) => {
                const data = doc.data();
                const hasAccess = await canAccessFile(data, req.user.role, req.user.uid);
                
                if (!hasAccess) return null;

                // Get URL
                let fileUrl = data.url || data.fileUrl;
                if (!fileUrl && data.storagePath && data.fileType !== 'link') {
                    try {
                        const [url] = await bucket.file(data.storagePath).getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 60 * 60 * 1000,
                        });
                        fileUrl = url;
                    } catch (e) {
                        console.error(`Error signing URL for ${data.storagePath}:`, e.message);
                    }
                }

                return { 
                    id: doc.id, 
                    ...data, 
                    url: fileUrl,
                    fileUrl: fileUrl,
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
            if (!id) {
                return res.status(400).json({ success: false, error: 'File ID required' });
            }
            
            const doc = await db.collection('files').doc(id).get();
            if (!doc.exists) return res.status(404).json({ success: false, error: 'File not found' });
            
            const data = doc.data();
            if (data.uploadedByUid !== req.user.uid && req.user.role !== 'director') {
                return res.status(403).json({ success: false, error: 'Permission denied' });
            }

            // Delete from storage
            if (data.storagePath) {
                await bucket.file(data.storagePath).delete().catch(e => console.log('Storage delete error:', e.message));
            }
            
            // Delete from Firestore
            await db.collection('files').doc(id).delete();
            
            console.log(`🗑️ File deleted: ${data.originalName || data.fileName}`);
            
            return res.status(200).json({ success: true, message: 'File deleted successfully' });
        }

        // ============================================
        // POST - ADD LINKS (JSON Body)
        // ============================================
        if (req.method === 'POST') {
            // Parse body if not already parsed
            if (!req.body || Object.keys(req.body).length === 0) {
                await new Promise((resolve) => {
                    const chunks = [];
                    req.on('data', (chunk) => chunks.push(chunk));
                    req.on('end', () => {
                        try {
                            req.body = JSON.parse(Buffer.concat(chunks).toString());
                        } catch (e) {
                            req.body = {};
                        }
                        resolve();
                    });
                });
            }

            const { links, proposalId, projectId } = req.body;
            
            if (links && Array.isArray(links)) {
                const batch = db.batch();
                const savedLinks = [];
                
                links.forEach(link => {
                    const ref = db.collection('files').doc();
                    const linkData = {
                        url: link.url,
                        fileUrl: link.url,
                        fileName: link.title || link.name || 'Link',
                        originalName: link.title || link.name || 'Link',
                        description: link.description || '',
                        proposalId: proposalId || null,
                        projectId: projectId || null,
                        fileType: 'link',
                        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                        uploadedByUid: req.user.uid,
                        uploadedByName: req.user.name
                    };
                    batch.set(ref, linkData);
                    savedLinks.push({ id: ref.id, ...linkData });
                });
                
                await batch.commit();
                console.log(`🔗 ${links.length} links saved`);
                
                return res.status(201).json({ success: true, data: savedLinks });
            }
            
            return res.status(400).json({ success: false, error: 'Invalid request body' });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });

    } catch (error) {
        console.error('Files API Error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = allowCors(handler);
