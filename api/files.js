const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const multer = require('multer');

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Configure multer for file uploads
// WARNING: memoryStorage loads the ENTIRE file into your server's RAM.
// Ensure your server has enough RAM (3GB+) to handle these large uploads without crashing.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 * 1024, // 3GB limit per file
    },
    fileFilter: (req, file, cb) => {
        // Allow all file types. 
        // (Specific type restrictions can be added here if needed later)
        cb(null, true);
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

// Helper function to check file access permissions with BDM isolation
async function canAccessFile(file, userRole, userUid, proposalId = null) {
    // Get proposal to check ownership for BDMs
    let proposal = null;
    if (file.proposalId || proposalId) {
        const proposalDoc = await db.collection('proposals').doc(file.proposalId || proposalId).get();
        if (proposalDoc.exists) {
            proposal = proposalDoc.data();
        }
    }
    
    // BDMs can only access files from their own proposals
    if (userRole === 'bdm') {
        if (!proposal || proposal.createdByUid !== userUid) {
            return false;
        }
    }

    // If no proposal linked, files are accessible to non-BDM roles only
    if (!file.proposalId && !proposalId) {
        return userRole !== 'bdm'; // BDMs can only see files linked to their proposals
    }

    // Project files (uploaded by BDM) - accessible based on role
    if (!file.fileType || file.fileType === 'project' || file.fileType === 'link') {
        // For BDMs, already checked above
        // Other roles can access all project files
        return userRole !== 'bdm' || (proposal && proposal.createdByUid === userUid);
    }

    // Estimation files (uploaded by Estimator)
    if (file.fileType === 'estimation') {
        // Estimator, COO, and Director can always access
        if (['estimator', 'coo', 'director'].includes(userRole)) {
            return true;
        }
        
        // BDM can only access after director approval AND only for their own proposals
        if (userRole === 'bdm') {
            const proposalStatus = proposal?.status;
            return (proposal.createdByUid === userUid) && 
                   (proposalStatus === 'approved' || proposalStatus === 'submitted_to_client');
        }
    }

    return false;
}

// Helper function to filter files based on user permissions
async function filterFilesForUser(files, userRole, userUid) {
    const filteredFiles = [];
    
    for (const file of files) {
        const canAccess = await canAccessFile(file, userRole, userUid);
        if (canAccess) {
            // Add access control metadata
            filteredFiles.push({
                ...file,
                canView: true,
                canDownload: true,
                canDelete: file.uploadedByUid === userUid || userRole === 'director'
            });
        }
    }
    
    return filteredFiles;
}

const handler = async (req, res) => {
    try {
        await util.promisify(verifyToken)(req, res);

        if (req.method === 'GET') {
            const { proposalId, fileId } = req.query;
            
            if (fileId) {
                // Get specific file
                const fileDoc = await db.collection('files').doc(fileId).get();
                if (!fileDoc.exists) {
                    return res.status(404).json({ success: false, error: 'File not found' });
                }
                
                const fileData = fileDoc.data();
                const canAccess = await canAccessFile(fileData, req.user.role, req.user.uid);
                
                if (!canAccess) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Access denied. You do not have permission to view this file.' 
                    });
                }
                
                return res.status(200).json({ 
                    success: true, 
                    data: { 
                        id: fileDoc.id, 
                        ...fileData,
                        canView: true,
                        canDownload: true,
                        canDelete: fileData.uploadedByUid === req.user.uid || req.user.role === 'director'
                    } 
                });
            }
            
            // Get all files or files for a specific proposal
            let query = db.collection('files').orderBy('uploadedAt', 'desc');
            
            if (proposalId) {
                // Check if BDM can access this proposal
                if (req.user.role === 'bdm') {
                    const proposalDoc = await db.collection('proposals').doc(proposalId).get();
                    if (!proposalDoc.exists || proposalDoc.data().createdByUid !== req.user.uid) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Access denied. You can only view files from your own proposals.' 
                        });
                    }
                }
                query = query.where('proposalId', '==', proposalId);
            } else if (req.user.role === 'bdm') {
                // BDMs should only see files from their own proposals
                // First get all their proposals
                const proposalsSnapshot = await db.collection('proposals')
                    .where('createdByUid', '==', req.user.uid)
                    .get();
                const proposalIds = proposalsSnapshot.docs.map(doc => doc.id);
                
                if (proposalIds.length === 0) {
                    return res.status(200).json({ success: true, data: [] });
                }
                
                // Then get files for those proposals
                query = query.where('proposalId', 'in', proposalIds);
            }
            
            const snapshot = await query.get();
            const allFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Filter files based on user permissions
            const filteredFiles = await filterFilesForUser(allFiles, req.user.role, req.user.uid);
            
            return res.status(200).json({ success: true, data: filteredFiles });
        }

        if (req.method === 'POST') {
            // Check if this is a link upload or file upload
            const contentType = req.headers['content-type'];
            
            if (contentType && contentType.includes('application/json')) {
                // Handle link upload
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
                
                const { links, proposalId, fileType = 'link' } = req.body;
                
                if (!links || !Array.isArray(links) || links.length === 0) {
                    return res.status(400).json({ success: false, error: 'No links provided' });
                }
                
                // Check if BDM can upload to this proposal
                if (req.user.role === 'bdm' && proposalId) {
                    const proposalDoc = await db.collection('proposals').doc(proposalId).get();
                    if (!proposalDoc.exists || proposalDoc.data().createdByUid !== req.user.uid) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'You can only add files to your own proposals.' 
                        });
                    }
                }
                
                const uploadedLinks = [];
                
                for (const link of links) {
                    const linkData = {
                        fileName: null, // No physical file
                        originalName: link.title || link.url,
                        url: link.url,
                        mimeType: 'text/url',
                        fileSize: 0,
                        proposalId: proposalId || null,
                        fileType: 'link',
                        linkDescription: link.description || '',
                        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                        uploadedByUid: req.user.uid,
                        uploadedByName: req.user.name,
                        uploadedByRole: req.user.role
                    };
                    
                    const docRef = await db.collection('files').add(linkData);
                    uploadedLinks.push({ id: docRef.id, ...linkData });
                    
                    // Log activity
                    await db.collection('activities').add({
                        type: 'link_added',
                        details: `Link added: ${link.title || link.url}${proposalId ? ` for proposal ${proposalId}` : ''}`,
                        performedByName: req.user.name,
                        performedByRole: req.user.role,
                        performedByUid: req.user.uid,
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                        proposalId: proposalId || null,
                        fileId: docRef.id
                    });
                }
                
                return res.status(201).json({ 
                    success: true, 
                    data: uploadedLinks,
                    message: `${uploadedLinks.length} link(s) added successfully` 
                });
                
            } else {
                // Handle file upload with multer
                // Allows up to 10 files per request
                return new Promise((resolve, reject) => {
                    upload.array('files', 10)(req, res, async (err) => {
                        if (err) {
                            console.error('Multer error:', err);
                            if (err.code === 'LIMIT_FILE_SIZE') {
                                return res.status(400).json({ success: false, error: 'File too large. Maximum size is 3GB.' });
                            }
                            if (err.code === 'LIMIT_FILE_COUNT') {
                                return res.status(400).json({ success: false, error: 'Too many files. Maximum is 10 at once.' });
                            }
                            return res.status(400).json({ success: false, error: 'File upload error: ' + err.message });
                        }

                        try {
                            // Check if files were uploaded
                            if (!req.files || req.files.length === 0) {
                                return res.status(400).json({ success: false, error: 'No files provided' });
                            }

                            const { proposalId, fileType = 'project' } = req.body;
                            const uploadedFiles = [];

                            // Check if BDM can upload to this proposal
                            if (req.user.role === 'bdm' && proposalId) {
                                const proposalDoc = await db.collection('proposals').doc(proposalId).get();
                                if (!proposalDoc.exists || proposalDoc.data().createdByUid !== req.user.uid) {
                                    return res.status(403).json({ 
                                        success: false, 
                                        error: 'You can only add files to your own proposals.' 
                                    });
                                }
                            }

                            // Validate file type permissions
                            if (fileType === 'estimation' && req.user.role !== 'estimator') {
                                return res.status(403).json({ 
                                    success: false, 
                                    error: 'Only estimators can upload estimation files' 
                                });
                            }

                            if (fileType === 'project' && req.user.role !== 'bdm') {
                                return res.status(403).json({ 
                                    success: false, 
                                    error: 'Only BDMs can upload project files' 
                                });
                            }

                            for (const file of req.files) {
                                const fileName = `${proposalId || 'general'}/${Date.now()}-${file.originalname}`;
                                const fileRef = bucket.file(fileName);
                                
                                // Upload from RAM buffer to Firebase Storage
                                await fileRef.save(file.buffer, {
                                    metadata: {
                                        contentType: file.mimetype,
                                    },
                                    resumable: false // Simple uploads for memory buffers
                                });

                                // Make file publicly accessible
                                await fileRef.makePublic();
                                
                                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

                                // Save file metadata to Firestore
                                const fileData = {
                                    fileName,
                                    originalName: file.originalname,
                                    url: publicUrl,
                                    mimeType: file.mimetype,
                                    fileSize: file.size,
                                    proposalId: proposalId || null,
                                    fileType: fileType,
                                    uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                                    uploadedByUid: req.user.uid,
                                    uploadedByName: req.user.name,
                                    uploadedByRole: req.user.role
                                };

                                const docRef = await db.collection('files').add(fileData);
                                uploadedFiles.push({ id: docRef.id, ...fileData });

                                // Log activity
                                await db.collection('activities').add({
                                    type: 'file_uploaded',
                                    details: `File uploaded: ${file.originalname}${proposalId ? ` for proposal ${proposalId}` : ''}`,
                                    performedByName: req.user.name,
                                    performedByRole: req.user.role,
                                    performedByUid: req.user.uid,
                                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                                    proposalId: proposalId || null,
                                    fileId: docRef.id
                                });
                            }

                            return res.status(201).json({ 
                                success: true, 
                                data: uploadedFiles,
                                message: `${uploadedFiles.length} file(s) uploaded successfully` 
                            });

                        } catch (error) {
                            console.error('File upload error:', error);
                            return res.status(500).json({ 
                                success: false, 
                                error: 'Internal Server Error', 
                                message: error.message 
                            });
                        }
                    });
                });
            }
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ success: false, error: 'File ID required' });
            }

            const fileDoc = await db.collection('files').doc(id).get();
            if (!fileDoc.exists) {
                return res.status(404).json({ success: false, error: 'File not found' });
            }

            const fileData = fileDoc.data();

            // Check delete permissions
            if (fileData.uploadedByUid !== req.user.uid && req.user.role !== 'director') {
                return res.status(403).json({ 
                    success: false, 
                    error: 'You can only delete files you uploaded, or you must be a director' 
                });
            }

            // Only delete from storage if it's not a link
            if (fileData.fileType !== 'link' && fileData.fileName) {
                try {
                    await bucket.file(fileData.fileName).delete();
                } catch (storageError) {
                    console.warn('File not found in storage, continuing with database deletion');
                }
            }

            // Delete from Firestore
            await fileDoc.ref.delete();

            // Log activity
            await db.collection('activities').add({
                type: fileData.fileType === 'link' ? 'link_deleted' : 'file_deleted',
                details: `${fileData.fileType === 'link' ? 'Link' : 'File'} deleted: ${fileData.originalName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: fileData.proposalId || null
            });

            return res.status(200).json({ 
                success: true, 
                message: `${fileData.fileType === 'link' ? 'Link' : 'File'} deleted successfully` 
            });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });
    } catch (error) {
        console.error('Files API error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

module.exports = allowCors(handler);
