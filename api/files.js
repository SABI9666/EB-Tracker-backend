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

// --- HELPER FUNCTIONS ---

async function canAccessFile(file, userRole, userUid, proposalId = null) {
    let proposal = null;
    if (file.proposalId || proposalId) {
        const proposalDoc = await db.collection('proposals').doc(file.proposalId || proposalId).get();
        if (proposalDoc.exists) proposal = proposalDoc.data();
    }
    
    if (userRole === 'bdm') {
        if (!proposal || proposal.createdByUid !== userUid) return false;
    }

    if (!file.proposalId && !proposalId) return userRole !== 'bdm';

    if (!file.fileType || file.fileType === 'project' || file.fileType === 'link') {
        return userRole !== 'bdm' || (proposal && proposal.createdByUid === userUid);
    }

    if (file.fileType === 'estimation') {
        if (['estimator', 'coo', 'director'].includes(userRole)) return true;
        if (userRole === 'bdm') {
            const proposalStatus = proposal?.status;
            return (proposal.createdByUid === userUid) && 
                   (proposalStatus === 'approved' || proposalStatus === 'submitted_to_client');
        }
    }
    return false;
}

async function filterFilesForUser(files, userRole, userUid) {
    const filteredFiles = [];
    for (const file of files) {
        if (await canAccessFile(file, userRole, userUid)) {
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

async function checkUploadPermissions(user, proposalId, fileType) {
    if (user.role === 'bdm' && proposalId) {
        const proposalDoc = await db.collection('proposals').doc(proposalId).get();
        if (!proposalDoc.exists || proposalDoc.data().createdByUid !== user.uid) {
            throw new Error('Access denied: You can only add files to your own proposals.');
        }
    }
    if (fileType === 'estimation' && user.role !== 'estimator') {
        throw new Error('Access denied: Only estimators can upload estimation files.');
    }
    if (fileType === 'project' && user.role !== 'bdm' && user.role !== 'design_lead' && user.role !== 'designer') {
         // Allow Design team to upload project files too
         throw new Error('Access denied: You do not have permission to upload project files.');
    }
    return true;
}

// --- MAIN HANDLER ---

const handler = async (req, res) => {
    try {
        await util.promisify(verifyToken)(req, res);

        if (req.method === 'GET') {
            const { proposalId, fileId } = req.query;
            
            if (fileId) {
                const fileDoc = await db.collection('files').doc(fileId).get();
                if (!fileDoc.exists) return res.status(404).json({ success: false, error: 'File not found' });
                
                const fileData = fileDoc.data();
                if (!await canAccessFile(fileData, req.user.role, req.user.uid)) {
                    return res.status(403).json({ success: false, error: 'Access denied.' });
                }
                return res.status(200).json({ 
                    success: true, 
                    data: { ...fileData, id: fileDoc.id, canView: true, canDownload: true, canDelete: fileData.uploadedByUid === req.user.uid || req.user.role === 'director' } 
                });
            }
            
            let query = db.collection('files').orderBy('uploadedAt', 'desc');
            if (proposalId) {
                 if (req.user.role === 'bdm') {
                    const proposalDoc = await db.collection('proposals').doc(proposalId).get();
                    if (!proposalDoc.exists || proposalDoc.data().createdByUid !== req.user.uid) {
                        return res.status(403).json({ success: false, error: 'Access denied to this proposal.' });
                    }
                }
                query = query.where('proposalId', '==', proposalId);
            } else if (req.user.role === 'bdm') {
                const proposalsSnapshot = await db.collection('proposals').where('createdByUid', '==', req.user.uid).get();
                const proposalIds = proposalsSnapshot.docs.map(doc => doc.id);
                if (proposalIds.length === 0) return res.status(200).json({ success: true, data: [] });
                query = query.where('proposalId', 'in', proposalIds);
            }
            
            const snapshot = await query.get();
            const allFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const filteredFiles = await filterFilesForUser(allFiles, req.user.role, req.user.uid);
            return res.status(200).json({ success: true, data: filteredFiles });
        }

        if (req.method === 'POST') {
            if (typeof req.body !== 'object') { 
                try { 
                    req.body = JSON.parse(req.body); 
                } catch (e) {
                    console.error('Failed to parse body:', e);
                } 
            }

            const { action, links, proposalId, fileType = 'project' } = req.body;

            // CASE 1: Upload Links
            if (links && Array.isArray(links)) {
                try {
                    await checkUploadPermissions(req.user, proposalId, 'link');
                    const uploadedLinks = [];
                    for (const link of links) {
                        const linkData = {
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
                    }
                    return res.status(201).json({ success: true, data: uploadedLinks });
                } catch (error) {
                    console.error('Link upload error:', error);
                    return res.status(403).json({ success: false, error: error.message });
                }
            }

            // CASE 2: Get Signed URL (Direct Upload)
            if (action === 'get_upload_url') {
                const { fileName, contentType, size } = req.body;
                
                console.log('📤 Getting upload URL for:', fileName, 'Size:', size, 'Type:', contentType);
                
                // --- 3GB LIMIT ENFORCEMENT ---
                const MAX_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
                if (size && size > MAX_SIZE) {
                     console.error('❌ File exceeds 3GB limit:', size);
                     return res.status(400).json({ success: false, error: 'File exceeds 3GB limit.' });
                }
                // -----------------------------

                if (!fileName) {
                    console.error('❌ Missing fileName in request');
                    return res.status(400).json({ success: false, error: 'Missing file details' });
                }

                try {
                    // Check permissions first
                    await checkUploadPermissions(req.user, proposalId, fileType);
                    
                    // Create storage path
                    const storagePath = `${proposalId || 'general'}/${Date.now()}-${fileName}`;
                    console.log('📁 Storage path:', storagePath);
                    
                    // Get file reference
                    const fileRef = bucket.file(storagePath);
                    
                    // Generate signed URL
                    console.log('🔐 Generating signed URL...');
                    const [uploadUrl] = await fileRef.getSignedUrl({
                        version: 'v4',
                        action: 'write',
                        expires: Date.now() + 60 * 60 * 1000, // 1 hour
                        contentType: contentType || 'application/octet-stream',
                    });

                    console.log('✅ Signed URL generated successfully');
                    return res.status(200).json({ 
                        success: true, 
                        data: { uploadUrl, storagePath } 
                    });

                } catch (error) {
                    console.error('❌ Error generating signed URL:', error);
                    console.error('Error details:', {
                        message: error.message,
                        code: error.code,
                        stack: error.stack
                    });
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Failed to generate upload URL: ' + error.message 
                    });
                }
            }

            // CASE 3: Finalize Upload
            if (action === 'finalize_upload') {
                const { storagePath, originalName, mimeType, fileSize } = req.body;
                
                console.log('✅ Finalizing upload:', originalName);
                
                if (!storagePath) {
                    console.error('❌ Missing storage path');
                    return res.status(400).json({ success: false, error: 'Missing storage path' });
                }

                try {
                    const fileRef = bucket.file(storagePath);
                    
                    // Verify the file exists in storage
                    console.log('🔍 Verifying file exists in storage...');
                    const [exists] = await fileRef.exists();
                    if (!exists) {
                        console.error('❌ File not found in storage:', storagePath);
                        return res.status(400).json({ 
                            success: false, 
                            error: 'File upload incomplete - file not found in storage' 
                        });
                    }
                    
                    // Make file public
                    console.log('🌐 Making file public...');
                    await fileRef.makePublic();
                    
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
                    console.log('✅ Public URL generated:', publicUrl);

                    // Save to Firestore
                    const fileData = {
                        fileName: storagePath,
                        originalName: originalName,
                        url: publicUrl,
                        mimeType: mimeType,
                        fileSize: fileSize,
                        proposalId: proposalId || null,
                        fileType: fileType,
                        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                        uploadedByUid: req.user.uid,
                        uploadedByName: req.user.name,
                        uploadedByRole: req.user.role
                    };

                    console.log('💾 Saving file record to Firestore...');
                    const docRef = await db.collection('files').add(fileData);
                    console.log('✅ File record saved:', docRef.id);
                    
                    // Log activity
                    await db.collection('activities').add({
                        type: 'file_uploaded',
                        details: `File uploaded: ${originalName}`,
                        performedByName: req.user.name,
                        performedByRole: req.user.role,
                        performedByUid: req.user.uid,
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                        proposalId: proposalId || null,
                        fileId: docRef.id
                    });

                    return res.status(201).json({ 
                        success: true, 
                        data: { id: docRef.id, ...fileData } 
                    });
                    
                } catch (error) {
                    console.error('❌ Finalize error:', error);
                    console.error('Error details:', {
                        message: error.message,
                        code: error.code,
                        stack: error.stack
                    });
                    return res.status(500).json({ 
                        success: false, 
                        error: 'Failed to finalize upload: ' + error.message 
                    });
                }
            }
            
            // If no action matched
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid action. Use get_upload_url or finalize_upload' 
            });
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            if (!id) return res.status(400).json({ success: false, error: 'File ID required' });

            const fileDoc = await db.collection('files').doc(id).get();
            if (!fileDoc.exists) return res.status(404).json({ success: false, error: 'File not found' });

            const fileData = fileDoc.data();
            if (fileData.uploadedByUid !== req.user.uid && req.user.role !== 'director') {
                return res.status(403).json({ success: false, error: 'Permission denied' });
            }

            if (fileData.fileType !== 'link' && fileData.fileName) {
                try { 
                    await bucket.file(fileData.fileName).delete(); 
                    console.log('✅ Deleted from storage:', fileData.fileName);
                } 
                catch (e) { 
                    console.warn('⚠️ Storage delete failed:', e.message); 
                }
            }

            await fileDoc.ref.delete();
            console.log('✅ Deleted from Firestore:', id);
            
             await db.collection('activities').add({
                type: 'file_deleted',
                details: `File deleted: ${fileData.originalName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: fileData.proposalId || null
            });
            
            return res.status(200).json({ success: true, message: 'Deleted successfully' });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });
        
    } catch (error) {
        console.error('❌ Files API error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            path: req.path,
            method: req.method,
            user: req.user?.email
        });
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

module.exports = allowCors(handler);




