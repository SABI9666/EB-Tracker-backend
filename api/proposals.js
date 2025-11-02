// / api/proposals.js - MODIFIED VERSION with PDF uploads and tonnage support
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const busboy = require('busboy');

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

// NEW: Validation for PDF files
function validatePDFFiles(files) {
    const MAX_FILES = 10; // Set maximum number of files allowed
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file
    
    if (files.length > MAX_FILES) {
        throw new Error(`Maximum ${MAX_FILES} files allowed`);
    }
    
    for (const file of files) {
        if (!file.mimeType || !file.mimeType.includes('pdf')) {
            throw new Error(`Only PDF files are allowed. Found: ${file.mimeType}`);
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File ${file.filename} exceeds maximum size of 50MB`);
        }
    }
    
    return true;
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
        if (req.method === 'POST' && !req.query.action) {
            const { 
                projectName, 
                clientCompany, 
                scopeOfWork, 
                projectType, 
                priority, 
                country, 
                timeline, 
                projectLinks,
                filesComment
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
                }],
                // NEW: Add fields for PDF management
                pdfFiles: [],
                filesComment: filesComment || '',
                totalFileSize: 0,
                fileCount: 0
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
            
            return res.status(201).json({ 
                success: true, 
                data: { id: docRef.id, ...newProposal },
                message: 'Proposal created successfully'
            });
        }

        // ============================================
        // POST - Upload PDF files for proposal
        // ============================================
        if (req.method === 'POST' && req.query.action === 'upload_pdfs') {
            const { proposalId } = req.query;
            
            if (!proposalId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Proposal ID is required' 
                });
            }

            const proposalRef = db.collection('proposals').doc(proposalId);
            const proposalDoc = await proposalRef.get();
            
            if (!proposalDoc.exists) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Proposal not found' 
                });
            }

            const proposalData = proposalDoc.data();
            
            // Security: Only creator can upload files
            if (proposalData.createdByUid !== req.user.uid) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'You can only upload files to your own proposals' 
                });
            }

            // Parse multipart form data (files)
            const bb = busboy({ headers: req.headers });
            
            const files = [];
            const fields = {};
            
            return new Promise((resolve, reject) => {
                bb.on('file', (fieldname, file, info) => {
                    const { filename, encoding, mimeType } = info;
                    
                    // Validate PDF
                    if (!mimeType.includes('pdf')) {
                        file.resume();
                        return reject(new Error('Only PDF files are allowed'));
                    }
                    
                    const chunks = [];
                    file.on('data', (chunk) => chunks.push(chunk));
                    file.on('end', () => {
                        const buffer = Buffer.concat(chunks);
                        files.push({
                            filename,
                            mimeType,
                            buffer,
                            size: buffer.length
                        });
                    });
                });
                
                bb.on('field', (fieldname, value) => {
                    fields[fieldname] = value;
                });
                
                bb.on('finish', async () => {
                    try {
                        // Validate file count
                        const MAX_FILES = 10;
                        const existingFileCount = proposalData.fileCount || 0;
                        
                        if (existingFileCount + files.length > MAX_FILES) {
                            return res.status(400).json({
                                success: false,
                                error: `Maximum ${MAX_FILES} files allowed. You already have ${existingFileCount} files.`
                            });
                        }
                        
                        // Validate file sizes
                        const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
                        for (const file of files) {
                            if (file.size > MAX_FILE_SIZE) {
                                return res.status(400).json({
                                    success: false,
                                    error: `File ${file.filename} exceeds 50MB limit`
                                });
                            }
                        }
                        
                        // Upload files to Firebase Storage
                        const uploadedFiles = [];
                        let totalSize = proposalData.totalFileSize || 0;
                        
                        for (const file of files) {
                            const timestamp = Date.now();
                            const safeName = file.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
                            const storagePath = `proposals/${proposalId}/${timestamp}_${safeName}`;
                            
                            const fileRef = bucket.file(storagePath);
                            await fileRef.save(file.buffer, {
                                metadata: {
                                    contentType: file.mimeType,
                                    metadata: {
                                        proposalId: proposalId,
                                        uploadedBy: req.user.name,
                                        uploadedByUid: req.user.uid
                                    }
                                }
                            });
                            
                            // Get signed URL (valid for 7 days)
                            const [url] = await fileRef.getSignedUrl({
                                action: 'read',
                                expires: Date.now() + 7 * 24 * 60 * 60 * 1000
                            });
                            
                            uploadedFiles.push({
                                fileName: file.filename,
                                storagePath: storagePath,
                                fileUrl: url,
                                fileSize: file.size,
                                mimeType: file.mimeType,
                                uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                                uploadedBy: req.user.name,
                                uploadedByUid: req.user.uid
                            });
                            
                            totalSize += file.size;
                        }
                        
                        // Update proposal with file metadata
                        await proposalRef.update({
                            pdfFiles: admin.firestore.FieldValue.arrayUnion(...uploadedFiles),
                            filesComment: fields.filesComment || proposalData.filesComment || '',
                            fileCount: existingFileCount + files.length,
                            totalFileSize: totalSize,
                            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                            changeLog: admin.firestore.FieldValue.arrayUnion({
                                timestamp: new Date().toISOString(),
                                action: 'files_uploaded',
                                performedByName: req.user.name,
                                details: `Uploaded ${files.length} PDF file(s)`
                            })
                        });
                        
                        // Log activity
                        await db.collection('activities').add({
                            type: 'proposal_files_uploaded',
                            details: `${files.length} PDF file(s) uploaded to proposal "${proposalData.projectName}"`,
                            performedByName: req.user.name,
                            performedByRole: req.user.role,
                            performedByUid: req.user.uid,
                            timestamp: admin.firestore.FieldValue.serverTimestamp(),
                            proposalId: proposalId,
                            projectName: proposalData.projectName,
                            fileCount: files.length
                        });
                        
                        return res.status(200).json({
                            success: true,
                            message: `${files.length} file(s) uploaded successfully`,
                            uploadedFiles: uploadedFiles.map(f => ({
                                fileName: f.fileName,
                                fileSize: f.fileSize
                            }))
                        });
                        
                    } catch (error) {
                        console.error('Error uploading files:', error);
                        return res.status(500).json({
                            success: false,
                            error: 'Error uploading files: ' + error.message
                        });
                    }
                });
                
                bb.on('error', (error) => {
                    reject(error);
                });
                
                req.pipe(bb);
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
                // NEW: Update files comment
                case 'update_files_comment':
                    if (proposal.createdByUid !== req.user.uid && !['coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Unauthorized to update this proposal' 
                        });
                    }

                    updates = {
                        filesComment: data.filesComment || '',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    
                    activityDetail = 'Files comment updated';
                    break;

                case 'add_links':
                    updates = { 
                        projectLinks: data.links || [],
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    activityDetail = `Project links added`;
                    break;
                    
                // MODIFIED: Enhanced estimation with tonnage support
                case 'add_estimation':
                    if (!['estimator', 'coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only Estimator, COO, or Director can add estimation' 
                        });
                    }
                    
                    // Validate estimation data
                    if (!data.totalManhours || data.totalManhours <= 0) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Total manhours must be greater than 0' 
                        });
                    }
                    
                    // Validate based on rate method
                    if (data.rateMethod === 'hourly' || data.rateMethod === 'combined') {
                        if (!data.hourlyRate || data.hourlyRate <= 0) {
                            return res.status(400).json({ 
                                success: false, 
                                error: 'Valid hourly rate is required for this rate method' 
                            });
                        }
                    }
                    
                    if (data.rateMethod === 'tonnage' || data.rateMethod === 'combined') {
                        if (!data.tonnage || data.tonnage <= 0) {
                            return res.status(400).json({ 
                                success: false, 
                                error: 'Valid tonnage is required for this rate method' 
                            });
                        }
                        if (!data.tonnageRate || data.tonnageRate <= 0) {
                            return res.status(400).json({ 
                                success: false, 
                                error: 'Valid tonnage rate is required for this rate method' 
                            });
                        }
                    }
                    
                    updates = {
                        estimation: {
                            totalManhours: parseFloat(data.totalManhours),
                            tonnage: data.tonnage ? parseFloat(data.tonnage) : null,
                            rateMethod: data.rateMethod || 'none',
                            hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : null,
                            tonnageRate: data.tonnageRate ? parseFloat(data.tonnageRate) : null,
                            estimatedValue: parseFloat(data.estimatedValue || 0),
                            breakdown: data.breakdown || {},
                            notes: data.notes || '',
                            estimatorName: req.user.name,
                            estimatorUid: req.user.uid,
                            estimatedAt: admin.firestore.FieldValue.serverTimestamp(),
                            // Keep backward compatibility
                            manhours: parseFloat(data.totalManhours),
                            boqUploaded: data.boqUploaded || false
                        },
                        status: 'estimation_complete'
                    };
                    
                    activityDetail = `Estimation added by ${req.user.name}: ${data.totalManhours} manhours`;
                    
                    if (data.rateMethod !== 'none') {
                        activityDetail += `, estimated value: $${parseFloat(data.estimatedValue || 0).toFixed(2)}`;
                    }
                    
                    if (data.tonnage) {
                        activityDetail += `, tonnage: ${data.tonnage} tons`;
                    }
                    
                    await db.collection('notifications').add({
                        type: 'estimation_complete',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Estimation completed for "${proposal.projectName}" - ${data.totalManhours} hours${data.tonnage ? `, ${data.tonnage} tons` : ''}, Value: $${parseFloat(data.estimatedValue || 0).toFixed(2)}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'normal'
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
                        message: `Your proposal "${proposal.projectName}" has been approved by ${req.user.name}. You can now submit it to the client.`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    
                    // Notify COO
                    await db.collection('notifications').add({
                        type: 'proposal_approved',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Proposal "${proposal.projectName}" has been approved by Director ${req.user.name}`,
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
                            reason: data.reason.trim(),
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
                        message: `Your proposal "${proposal.projectName}" has been rejected by ${req.user.name}. Reason: ${data.reason}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    
                    // Notify COO
                    await db.collection('notifications').add({
                        type: 'proposal_rejected',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Proposal "${proposal.projectName}" rejected by Director ${req.user.name}. Reason: ${data.reason}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                    break;
                    
                // ==================================================================
                // == END OF DIRECTOR APPROVE/REJECT ==
                // ==================================================================

                case 'create_project':
                    // Only COO or Director can create projects
                    if (!['coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only COO or Director can create projects' 
                        });
                    }
                    
                    if (proposal.status !== 'won') {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Only WON proposals can be converted to projects' 
                        });
                    }
                    
                    if (proposal.projectCreated) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'This proposal has already been converted to a project' 
                        });
                    }
                    
                    if (!proposal.pricing || !proposal.pricing.projectNumber) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Proposal must have pricing and project number before creating a project' 
                        });
                    }
                    
                    // Create the project
                    const projectData = {
                        projectName: proposal.projectName,
                        projectCode: proposal.pricing.projectNumber,
                        clientCompany: proposal.clientCompany,
                        projectType: proposal.projectType,
                        scopeOfWork: proposal.scopeOfWork,
                        timeline: proposal.timeline,
                        priority: proposal.priority,
                        country: proposal.country,
                        projectLinks: proposal.projectLinks || [],
                        status: 'needs_allocation',
                        designStatus: 'not_started',
                        totalManHours: proposal.estimation?.manhours || proposal.estimation?.totalManhours || 0,
                        quoteValue: proposal.pricing.quoteValue,
                        currency: proposal.pricing.currency,
                        bdmName: proposal.createdByName,
                        bdmUid: proposal.createdByUid,
                        proposalId: id,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        createdByName: req.user.name,
                        createdByUid: req.user.uid,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    
                    const projectRef = await db.collection('projects').add(projectData);
                    
                    updates = {
                        projectCreated: true,
                        projectId: projectRef.id,
                        allocationStatus: 'needs_allocation'
                    };
                    
                    activityDetail = `Project created from proposal by ${req.user.name}`;
                    
                    // Log project creation activity
                    await db.collection('activities').add({
                        type: 'project_created',
                        details: `Project created from proposal: ${proposal.projectName}`,
                        performedByName: req.user.name,
                        performedByRole: req.user.role,
                        performedByUid: req.user.uid,
                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                        projectId: projectRef.id,
                        proposalId: id,
                        projectName: proposal.projectName
                    });
                    
                    // Notify BDM
                    await db.collection('notifications').add({
                        type: 'project_created',
                        recipientUid: proposal.createdByUid,
                        recipientRole: 'bdm',
                        proposalId: id,
                        projectId: projectRef.id,
                        message: `Your proposal "${proposal.projectName}" has been converted to a project!`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'normal'
                    });
                    break;

                // ============================================
                // == BDM REQUEST FOR APPROVAL (NEW CASE) ==
                // ============================================
                case 'request_approval':
                    // Only BDM who created the proposal can request approval
                    if (req.user.role !== 'bdm' || proposal.createdByUid !== req.user.uid) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'Only the BDM who created this proposal can request approval' 
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

            // Delete associated PDF files from storage
            if (proposalData.pdfFiles && proposalData.pdfFiles.length > 0) {
                const deletePromises = proposalData.pdfFiles.map(file => {
                    return bucket.file(file.storagePath).delete().catch(err => {
                        console.warn('File not found in storage:', file.storagePath);
                    });
                });
                await Promise.all(deletePromises);
            }

            // Delete associated files from 'files' collection
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
