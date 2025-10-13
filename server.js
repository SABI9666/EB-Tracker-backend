// server.js - Backend server with file upload handling and robust Firebase initialization

// --- Core Dependencies ---
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const multer = require('multer');
const path = require('path');

// --- Firebase Admin Setup with Enhanced Error Handling ---
const admin = require('firebase-admin');
let db = null;
let isFirebaseInitialized = false;

try {
    console.log('🔧 Initializing Firebase Admin SDK...');
    
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    let serviceAccount;
    const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();

    // Support both Base64 encoded and direct JSON formats
    try {
        // Try Base64 decoding first (common for environment variables with special characters)
        if (envKey.startsWith('eyJ') || /^[A-Za-z0-9+/=]+$/.test(envKey.substring(0, 50))) {
            console.log('📦 Detected Base64 encoded Firebase key, decoding...');
            const decoded = Buffer.from(envKey, 'base64').toString('utf-8');
            serviceAccount = JSON.parse(decoded);
            console.log('✓ Base64 key decoded successfully');
        } else {
            console.log('📄 Using direct JSON Firebase key');
            serviceAccount = JSON.parse(envKey);
        }
    } catch (parseError) {
        console.error('Failed to parse Firebase key:', parseError.message);
        throw new Error(`Invalid Firebase service account format: ${parseError.message}`);
    }

    // Validate service account structure
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error('Invalid service account: missing required fields (project_id, private_key, client_email)');
    }

    // Initialize Firebase Admin
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
    });

    // Initialize Firestore
    db = admin.firestore();
    isFirebaseInitialized = true;
    
    console.log('✅ Firebase Admin initialized successfully');
    console.log(`   Project ID: ${serviceAccount.project_id}`);
    console.log(`   Storage Bucket: ${serviceAccount.project_id}.appspot.com`);
    console.log(`   Client Email: ${serviceAccount.client_email}`);

} catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.error('\n⚠️  SERVER WILL START IN LIMITED MODE (Firebase features disabled)\n');
    console.error('📋 Troubleshooting Guide:');
    console.error('   1. Go to Firebase Console: https://console.firebase.google.com/');
    console.error('   2. Select your project → Project Settings → Service Accounts');
    console.error('   3. Click "Generate New Private Key" and download the JSON file');
    console.error('   4. In Render Dashboard → Your Service → Environment tab');
    console.error('   5. Add environment variable:');
    console.error('      • Key: FIREBASE_SERVICE_ACCOUNT_KEY');
    console.error('      • Value: Paste the ENTIRE JSON content (including { and })');
    console.error('   6. OR encode it as Base64:');
    console.error('      • Run: cat firebase-key.json | base64');
    console.error('      • Paste the Base64 string as the value');
    console.error('   7. Save and redeploy\n');
    
    db = null;
    isFirebaseInitialized = false;
}

// Middleware to protect Firebase-dependent routes
const requireFirebase = (req, res, next) => {
    if (!isFirebaseInitialized || !db) {
        console.warn('⚠️  Firebase-dependent endpoint called but Firebase is not initialized');
        return res.status(503).json({
            success: false,
            error: 'Firebase service is currently unavailable',
            message: 'The server is running but Firebase is not properly configured. Please contact the administrator.',
            details: 'Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable'
        });
    }
    next();
};

// --- Placeholder Middleware & Helpers ---
const authenticate = async (req, res, next) => {
    console.log('🔐 Auth middleware: Authenticating request...');
    
    // TODO: Replace with real authentication
    // Example real implementation:
    // try {
    //     const idToken = req.headers.authorization?.split('Bearer ')[1];
    //     if (!idToken) throw new Error('No token provided');
    //     const decodedToken = await admin.auth().verifyIdToken(idToken);
    //     const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    //     req.user = { uid: decodedToken.uid, ...userDoc.data() };
    //     next();
    // } catch (error) {
    //     res.status(401).json({ success: false, error: 'Unauthorized' });
    // }
    
    // Stub for development
    req.user = {
        uid: 'STUB_USER_ID',
        name: 'Stub User',
        role: 'bdm'
    };
    next();
};

const logActivity = async (uid, name, role, type, details, proposalId = null) => {
    console.log(`📝 Activity Log: User ${name} (${uid}) - ${details}`);
    
    // TODO: Replace with real activity logging
    // if (isFirebaseInitialized && db) {
    //     await db.collection('activities').add({
    //         uid, name, role, type, details, proposalId,
    //         timestamp: admin.firestore.FieldValue.serverTimestamp()
    //     });
    // }
};

// --- API Route Handlers (Placeholders) ---
const proposalsHandler = express.Router().get('/', (req, res) => res.json({ message: 'Proposals endpoint' }));
const notificationsHandler = express.Router().get('/', (req, res) => res.json({ message: 'Notifications endpoint' }));
const dashboardHandler = express.Router().get('/', (req, res) => res.json({ message: 'Dashboard endpoint' }));
const activitiesHandler = express.Router().get('/', (req, res) => res.json({ message: 'Activities endpoint' }));
const projectsHandler = express.Router().get('/', (req, res) => res.json({ message: 'Projects endpoint' }));
const tasksHandler = express.Router().get('/', (req, res) => res.json({ message: 'Tasks endpoint' }));
const paymentsHandler = express.Router().get('/', (req, res) => res.json({ message: 'Payments endpoint' }));
const submissionsHandler = express.Router().get('/', (req, res) => res.json({ message: 'Submissions endpoint' }));

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 10 // Max 10 files per request
    },
    fileFilter: (req, file, cb) => {
        console.log(`📎 Receiving file: ${file.originalname} (${file.mimetype})`);
        cb(null, true); // Accept all file types
    }
});

// --- Core Middleware ---

// Security with Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// CORS Configuration
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:5000',
            'http://127.0.0.1:5000',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://eb-tracker-42881.web.app',
            'https://eb-tracker-42881.firebaseapp.com'
        ];

        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log('⚠️  CORS: Blocked request from origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// Performance & Logging
app.use(compression());
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));

// Body Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- API Routes ---

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'EB-Tracker Backend API',
        status: 'running',
        firebase: isFirebaseInitialized ? 'connected' : 'disconnected',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        firebase: isFirebaseInitialized ? 'healthy' : 'unavailable',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// File upload endpoint
app.post('/api/files', requireFirebase, authenticate, upload.array('files', 10), async (req, res) => {
    console.log('\n📤 File upload request received');
    console.log(`   User: ${req.user.uid} (${req.user.name})`);
    console.log(`   Body:`, req.body);
    console.log(`   Files: ${req.files ? req.files.length : 0}`);

    try {
        const { proposalId, fileType = 'project' } = req.body;
        let { links } = req.body;

        // Handle link uploads (no files, just URLs)
        if (links) {
            console.log('🔗 Processing link uploads...');
            const parsedLinks = typeof links === 'string' ? JSON.parse(links) : links;
            const uploadedLinks = [];

            for (const link of parsedLinks) {
                const linkDoc = {
                    proposalId: proposalId || null,
                    url: link.url,
                    originalName: link.title || link.url,
                    linkDescription: link.description || '',
                    fileType: 'link',
                    uploadedBy: req.user.uid,
                    uploadedByName: req.user.name,
                    uploadedByRole: req.user.role,
                    uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                };

                const docRef = await db.collection('files').add(linkDoc);
                uploadedLinks.push({ id: docRef.id, ...linkDoc });
            }

            console.log(`✅ Uploaded ${uploadedLinks.length} link(s)`);

            await logActivity(
                req.user.uid,
                req.user.name,
                req.user.role,
                'file_upload',
                `Uploaded ${uploadedLinks.length} project link(s)`,
                proposalId
            );

            return res.json({
                success: true,
                message: `${uploadedLinks.length} link(s) uploaded successfully`,
                data: uploadedLinks
            });
        }

        // Handle file uploads
        if (!req.files || req.files.length === 0) {
            console.log('⚠️  No files provided');
            return res.status(400).json({
                success: false,
                error: 'No files provided'
            });
        }

        console.log(`📁 Processing ${req.files.length} file upload(s)...`);
        const uploadedFiles = [];
        const bucket = admin.storage().bucket();

        for (const file of req.files) {
            console.log(`   ⬆️  Uploading: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

            try {
                // Create unique filename
                const timestamp = Date.now();
                const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `${fileType}/${proposalId || 'general'}/${timestamp}_${sanitizedFilename}`;

                // Upload to Firebase Storage
                const fileUpload = bucket.file(filename);

                await fileUpload.save(file.buffer, {
                    metadata: {
                        contentType: file.mimetype,
                        metadata: {
                            originalName: file.originalname,
                            uploadedBy: req.user.uid,
                            uploadedByName: req.user.name,
                            proposalId: proposalId || 'general'
                        }
                    }
                });

                // Make file publicly accessible
                await fileUpload.makePublic();

                // Get public URL
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

                // Save metadata to Firestore
                const fileDoc = {
                    proposalId: proposalId || null,
                    filename: filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    fileSize: file.size,
                    url: publicUrl,
                    fileType: fileType,
                    uploadedBy: req.user.uid,
                    uploadedByName: req.user.name,
                    uploadedByRole: req.user.role,
                    uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                };

                const docRef = await db.collection('files').add(fileDoc);
                uploadedFiles.push({ id: docRef.id, ...fileDoc });

                console.log(`   ✅ Uploaded: ${file.originalname}`);

            } catch (fileError) {
                console.error(`   ❌ Failed to upload ${file.originalname}:`, fileError.message);
                // Continue with other files
            }
        }

        if (uploadedFiles.length === 0) {
            throw new Error('All file uploads failed');
        }

        console.log(`✅ Successfully uploaded ${uploadedFiles.length} file(s)\n`);

        await logActivity(
            req.user.uid,
            req.user.name,
            req.user.role,
            'file_upload',
            `Uploaded ${uploadedFiles.length} file(s)`,
            proposalId
        );

        res.json({
            success: true,
            message: `${uploadedFiles.length} file(s) uploaded successfully`,
            data: uploadedFiles
        });

    } catch (error) {
        console.error('❌ File upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'File upload failed'
        });
    }
});

// Test file upload endpoint
app.post('/api/files/test', requireFirebase, authenticate, upload.single('testFile'), async (req, res) => {
    console.log('🧪 Test file upload endpoint');
    console.log('   File:', req.file ? req.file.originalname : 'none');
    console.log('   Body:', req.body);

    if (!req.file) {
        return res.json({
            success: false,
            message: 'No file received',
            body: req.body
        });
    }

    res.json({
        success: true,
        message: 'Test file received successfully',
        file: {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            sizeFormatted: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`
        }
    });
});

// Mount API routers
const apiRouter = express.Router();
apiRouter.use('/proposals', proposalsHandler);
apiRouter.use('/notifications', notificationsHandler);
apiRouter.use('/dashboard', dashboardHandler);
apiRouter.use('/activities', activitiesHandler);
apiRouter.use('/projects', projectsHandler);
apiRouter.use('/tasks', tasksHandler);
apiRouter.use('/payments', paymentsHandler);
apiRouter.use('/submissions', submissionsHandler);
app.use('/api', apiRouter);

// --- Error Handling Middleware ---

// Multer error handler
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        console.error('Multer error:', error.code);
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                error: 'File too large. Maximum size is 50MB per file.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: 'Too many files. Maximum is 10 files per request.'
            });
        }
        return res.status(400).json({
            success: false,
            error: `File upload error: ${error.message}`
        });
    }
    next(error);
});

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// --- Server Startup ---
const server = app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║            EB-TRACKER BACKEND SERVER                      ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  Status:      🟢 RUNNING                                  ║`);
    console.log(`║  Port:        ${PORT.toString().padEnd(44)}║`);
    console.log(`║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(44)}║`);
    console.log(`║  Firebase:    ${(isFirebaseInitialized ? '🟢 Connected' : '🔴 Disconnected').padEnd(44)}║`);
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  Local:       http://localhost:${PORT.toString().padEnd(31)}║`);
    console.log(`║  Health:      http://localhost:${PORT}/health`.padEnd(60) + '║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM signal received. Closing server gracefully...');
    server.close(() => {
        console.log('✅ HTTP server closed');
        if (isFirebaseInitialized) {
            admin.app().delete().then(() => {
                console.log('✅ Firebase connection closed');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT signal received. Closing server gracefully...');
    server.close(() => {
        console.log('✅ Server shut down successfully');
        process.exit(0);
    });
});
