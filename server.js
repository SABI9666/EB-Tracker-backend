// server.js - Backend server with updated file upload handling

// --- Core Dependencies ---
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// 2. At the top of server.js, add multer for file handling:
const multer = require('multer');
const path = require('path');

// --- Firebase Admin Setup ---
const admin = require('firebase-admin');
let db = null;
let isFirebaseInitialized = false;
try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`
    });

    db = admin.firestore();
    isFirebaseInitialized = true;
    console.log('✓ Firebase Admin initialized successfully.');
} catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.error('⚠️  Server will start in LIMITED mode without Firebase.');
    console.error('📝 To enable Firebase:');
    console.error('   1. Go to Render Dashboard → Your Service → Environment');
    console.error('   2. Add environment variable: FIREBASE_SERVICE_ACCOUNT_KEY');
    console.error('   3. Value: Your Firebase service account JSON (entire content)');
    console.error('   4. Save and redeploy\n');
}
// Middleware to check if Firebase is available
const requireFirebase = (req, res, next) => {
    if (!isFirebaseInitialized || !db) {
        return res.status(503).json({
            success: false,
            error: 'Firebase is not configured. Please contact the administrator.',
            hint: 'Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable'
        });
    }
    next();
};


// --- Placeholder Middleware & Helpers ---
// NOTE: These are placeholder functions. Replace them with your actual implementation.
const authenticate = async (req, res, next) => {
    console.log('Auth middleware (stub): Faking user authentication.');
    // In a real app, you would verify an ID token from the Authorization header.
    // const idToken = req.headers.authorization?.split('Bearer ')[1];
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    req.user = {
        uid: 'STUB_USER_ID',
        name: 'Stub User',
        role: 'bdm'
    };
    next();
};

const logActivity = async (uid, name, role, type, details, proposalId = null) => {
    console.log(`Activity Log (stub): User ${name} (${uid}) ${details}`);
    // In a real app, you'd write this to a Firestore 'activities' collection.
    // await db.collection('activities').add({ /* ...activity data... */ });
};


// --- API Route Handlers ---
// These would be your router files for other parts of the API.
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

// Configure multer for memory storage (files stored in memory temporarily)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        console.log('📎 Receiving file:', file.originalname, file.mimetype);
        // Accept all file types
        cb(null, true);
    }
});


// --- Core Middleware ---

// 1. Security with Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// 4. IMPORTANT: Update CORS configuration to handle file uploads
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
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
            console.log('⚠️ CORS request from origin blocked:', origin);
            callback(new Error('This origin is not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
}));
// Handle preflight requests
app.options('*', cors());


// 3. Performance & Logging
app.use(compression());
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));

// 4. Body Parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// --- API Routes ---

// Root and Health Check
app.get('/', (req, res) => res.json({ message: 'EB-Tracker Backend API is running' }));
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));


// 3. REPLACE your existing /api/files POST endpoint with this:
app.post('/api/files', requireFirebase, authenticate, upload.array('files', 10), async (req, res) => {
    console.log('📤 File upload request received');
    console.log('User:', req.user.uid);
    console.log('Body:', req.body);
    console.log('Files:', req.files ? req.files.length : 0);

    try {
        const { proposalId, fileType = 'project' } = req.body;
        let { links } = req.body;

        // Handle link uploads (no files, just links)
        if (links) {
            console.log('📎 Processing link uploads...');
            // Links might be a JSON string if sent with FormData
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

            console.log('✅ Links uploaded:', uploadedLinks.length);

            // Log activity
            await logActivity(req.user.uid, req.user.name, req.user.role,
                 'file_upload', `Uploaded ${uploadedLinks.length} project link(s)`, proposalId);

            return res.json({
                success: true,
                message: 'Links uploaded successfully',
                data: uploadedLinks
            });
        }

        // Handle file uploads
        if (!req.files || req.files.length === 0) {
            console.log('⚠️ No files provided in request');
            return res.status(400).json({
                success: false,
                error: 'No files provided'
            });
        }

        console.log('📤 Processing file uploads...');
        const uploadedFiles = [];
        const bucket = admin.storage().bucket();

        for (const file of req.files) {
            console.log(`📎 Uploading file: ${file.originalname} (${file.size} bytes)`);

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

                console.log(`✅ File uploaded to Storage: ${filename}`);

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

                console.log(`✅ File metadata saved to Firestore: ${docRef.id}`);

            } catch (fileError) {
                console.error(`❌ Error uploading file ${file.originalname}:`, fileError);
                // Continue with other files even if one fails
            }
        }

        if (uploadedFiles.length === 0) {
            throw new Error('All file uploads failed');
        }

        console.log(`✅ Successfully uploaded ${uploadedFiles.length} file(s)`);

        // Log activity
        await logActivity(req.user.uid, req.user.name, req.user.role,
             'file_upload', `Uploaded ${uploadedFiles.length} file(s)`, proposalId);

        res.json({
            success: true,
            message: `${uploadedFiles.length} file(s) uploaded successfully`,
            data: uploadedFiles
        });

    } catch (error) {
        console.error('❌ File upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'File upload failed',
            details: error.stack
        });
    }
});


// 6. Add a test endpoint to verify file upload is working
app.post('/api/files/test', requireFirebase, authenticate, upload.single('testFile'), async (req, res) => {
    console.log('🧪 Test file upload endpoint hit');
    console.log('File received:', req.file);
    console.log('Body:', req.body);

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
            size: req.file.size
        }
    });
});
console.log('✅ File upload endpoints configured');


// Use other API routers
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

// 5. Add error handling middleware for multer errors
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        console.error('Multer error:', error);
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ // 413 Payload Too Large is more appropriate
                success: false,
                error: 'File size too large. Maximum size is 50MB per file.'
            });
        }
        return res.status(400).json({
            success: false,
            error: `File upload error: ${error.message}`
        });
    }
    next(error);
});

// 404 Not Found handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// General error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ success: false, error: 'An internal server error occurred' });
});


// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
});

