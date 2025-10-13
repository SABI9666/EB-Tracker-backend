// server.js - Backend server optimized for Render

// --- Core Dependencies ---
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// --- Platform Detection ---
const IS_RENDER = process.env.RENDER === 'true';
const IS_LOCAL = !IS_RENDER;

// --- API Handlers ---
const proposalsHandler = require('./api/proposals');
const filesHandler = require('./api/files');
const notificationsHandler = require('./api/notifications');
const dashboardHandler = require('./api/dashboard');
const activitiesHandler = require('./api/activities');
const projectsHandler = require('./api/projects');
const tasksHandler = require('./api/tasks');
const paymentsHandler = require('./api/payments');
const submissionsHandler = require('./api/submissions');

// --- Cron Jobs (Render/Local only) ---
let cronJobs;
if (IS_RENDER || IS_LOCAL) {
    try {
        cronJobs = require('./jobs');
    } catch (e) {
        console.warn("Could not load './jobs'. Cron jobs will be disabled.");
        cronJobs = null;
    }
}

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Core Middleware ---

// 1. Security with Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

// 2. CORS Configuration - FIXED to allow Vercel preview URLs
const corsOptions = {
    origin: function (origin, callback) {
        // In development, allow all origins
        if (!origin || process.env.NODE_ENV === 'development') {
            console.log('CORS: Allowing development origin');
            return callback(null, true);
        }
        
        // List of exact allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5000',
            'http://localhost:8080',
            'https://eb-traker.vercel.app',
            'https://eb-tracker-backend.onrender.com',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        // Check if origin exactly matches allowed origins
        if (allowedOrigins.includes(origin)) {
            console.log('CORS: Allowed exact match origin:', origin);
            return callback(null, true);
        }

        // FIXED: Allow ALL Vercel preview and production URLs
        // Vercel URLs follow patterns like:
        // - https://your-app.vercel.app (production)
        // - https://your-app-xyz123.vercel.app (preview)
        // - https://your-app-git-branch-username.vercel.app (git branch)
        if (origin.endsWith('.vercel.app')) {
            console.log('CORS: Allowed Vercel URL:', origin);
            return callback(null, true);
        }

        // Reject all other origins
        console.log('CORS: REJECTED origin:', origin);
        callback(new Error('This origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 3. Performance with Compression
app.use(compression());

// 4. Logging with Morgan
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));

// 5. Body Parsing for JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Root Endpoint ---
app.get('/', (req, res) => {
    res.json({
        message: 'EB-Tracker Backend API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            health: '/health',
            api: '/api/*'
        }
    });
});

// --- Health Check Endpoint ---
app.get('/health', async (req, res) => {
    const health = {
        status: 'OK',
        platform: IS_RENDER ? 'Render' : 'Local',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
    };

    try {
        const admin = require('./api/_firebase-admin');
        const db = admin.firestore();
        const healthDoc = db.collection('_health').doc('check');
        await healthDoc.set({ timestamp: new Date() });
        await healthDoc.delete();
        health.firebase = 'Connected';
    } catch (error) {
        console.error("Health check Firebase error:", error.message);
        health.firebase = 'Error: ' + error.message;
        health.status = 'Degraded';
    }

    res.status(health.status === 'OK' ? 200 : 503).json(health);
});

// --- API Routes ---
const apiRouter = express.Router();

apiRouter.use('/proposals', proposalsHandler);
apiRouter.use('/notifications', notificationsHandler);
apiRouter.use('/dashboard', dashboardHandler);
apiRouter.use('/activities', activitiesHandler);
apiRouter.use('/files', filesHandler);
apiRouter.use('/projects', projectsHandler);
apiRouter.use('/tasks', tasksHandler);
apiRouter.use('/payments', paymentsHandler);
apiRouter.use('/submissions', submissionsHandler);

app.use('/api', apiRouter);

// --- Platform-Specific Features (Cron Jobs) ---
if ((IS_RENDER || IS_LOCAL) && process.env.ENABLE_CRON_JOBS === 'true' && cronJobs) {
    cronJobs.startCronJobs();
    console.log('✓ Cron jobs initialized and started.');
}

// --- Error Handling ---
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.path,
        method: req.method
    });
});

app.use((err, req, res, next) => {
    console.error('Unhandled Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).json({
        success: false,
        error: isProduction ? 'An internal server error occurred.' : err.message,
        ...( !isProduction && { stack: err.stack } )
    });
});

// --- Server Startup ---
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('╔═══════════════════════════════════════╗');
    console.log('║       EB-Tracker Server Started        ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║ Platform:    ${IS_RENDER ? 'Render' : 'Local'}                ║`);
    console.log(`║ Port:        ${PORT}                       ║`);
    console.log(`║ Environment: ${process.env.NODE_ENV || 'development'}           ║`);
    console.log(`║ Cron Jobs:   ${process.env.ENABLE_CRON_JOBS === 'true' && cronJobs ? 'Enabled' : 'Disabled'}             ║`);
    console.log('╚═══════════════════════════════════════╝');
    console.log('');
    console.log('Server ready to accept connections');
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api/`);
    console.log('');
    console.log('CORS: Allowing all *.vercel.app domains');
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server.');
    if ((IS_RENDER || IS_LOCAL) && cronJobs) {
        cronJobs.stopCronJobs();
        console.log('Cron jobs stopped.');
    }
    server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received. Closing HTTP server.');
    if ((IS_RENDER || IS_LOCAL) && cronJobs) {
        cronJobs.stopCronJobs();
        console.log('Cron jobs stopped.');
    }
    server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });
});

