// server.js - Backend server optimized for Render

// --- Core Dependencies ---
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// --- Platform Detection ---
// This is useful for running the same code locally for testing.
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

// --- Middleware ---
// const { verifyToken } = require('./middleware/auth'); // Uncomment if you add auth middleware

// --- Cron Jobs (Render/Local only) ---
let cronJobs;
if (IS_RENDER || IS_LOCAL) {
    try {
        cronJobs = require('./cron-jobs');
    } catch (e) {
        console.warn("Could not load './cron-jobs'. Cron jobs will be disabled.");
        cronJobs = null;
    }
}

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Core Middleware ---

// 1. Security with Helmet
app.use(helmet());

// 2. CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Best practice: Pull allowed origins from environment variables.
        const allowedOrigins = [
            'http://localhost:3000',          // For local frontend dev
            'https://eb-traker.vercel.app',   // Your production frontend
            process.env.FRONTEND_URL          // Another potential frontend URL from .env
        ].filter(Boolean); // filter(Boolean) removes any undefined/null entries

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('This origin is not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. Performance with Compression
app.use(compression());

// 4. Logging with Morgan
app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));

// 5. Body Parsing for JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// --- Health Check Endpoint ---
// Essential for Render's automated health checks.
app.get('/health', async (req, res) => {
    const health = {
        status: 'OK',
        platform: IS_RENDER ? 'Render' : 'Local',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };

    // Optional but recommended: Check database connection.
    try {
        const admin = require('./api/_firebase-admin');
        const db = admin.firestore();
        // A quick, non-destructive write/delete confirms connectivity and permissions.
        const healthDoc = db.collection('_health').doc('check');
        await healthDoc.set({ timestamp: new Date() });
        await healthDoc.delete();
        health.firebase = 'Connected';
    } catch (error) {
        console.error("Health check Firebase error:", error.message);
        health.firebase = 'Error';
        health.status = 'Degraded'; // Signals that a critical dependency is failing.
    }

    res.status(health.status === 'OK' ? 200 : 503).json(health);
});


// --- API Routes ---
const apiRouter = express.Router();

// Register all API handlers.
apiRouter.use('/proposals', proposalsHandler);
apiRouter.use('/notifications', notificationsHandler);
apiRouter.use('/dashboard', dashboardHandler);
apiRouter.use('/activities', activitiesHandler);
apiRouter.use('/files', filesHandler); // File operations are handled directly on Render.
apiRouter.use('/projects', projectsHandler);
apiRouter.use('/tasks', tasksHandler);
apiRouter.use('/payments', paymentsHandler);
apiRouter.use('/submissions', submissionsHandler);

// Mount the API router under the /api prefix.
app.use('/api', apiRouter);


// --- Platform-Specific Features (Cron Jobs) ---
// This block ensures cron jobs only run on Render or a local machine.
if ((IS_RENDER || IS_LOCAL) && process.env.ENABLE_CRON_JOBS === 'true' && cronJobs) {
    cronJobs.startCronJobs();
    console.log('Cron jobs initialized and started.');
}

// --- Error Handling ---
// These must be the LAST `app.use()` calls.

// 404 Not Found Handler (for unmatched API routes).
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.path
    });
});

// General Error Handling Middleware.
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
        ...( !isProduction && { stack: err.stack } ) // Only show stack in development.
    });
});


// --- Server Startup ---
const server = app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║       EB-Tracker Server Started        ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║ Platform:    ${IS_RENDER ? 'Render' : 'Local'}                ║`);
    console.log(`║ Port:        ${PORT}                       ║`);
    console.log(`║ Environment: ${process.env.NODE_ENV || 'development'}           ║`);
    console.log(`║ Cron Jobs:   ${process.env.ENABLE_CRON_JOBS === 'true' && cronJobs ? 'Enabled' : 'Disabled'}             ║`);
    console.log('╚════════════════════════════════════════╝');
});

// --- Graceful Shutdown ---
// Important for Render to allow existing requests to finish before shutdown on deploys.
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