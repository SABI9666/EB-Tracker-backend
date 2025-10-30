// server.js - Complete backend entry point with EMAIL + TIMESHEET + VARIATIONS API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('dev'));

// CORS - PROPERLY CONFIGURED FOR YOUR FRONTEND
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'https://eb-tracker-frontend.vercel.app',
            'https://eb-tracker-frontend-*.vercel.app', // Vercel preview deployments
        ];
        
        // Check if origin matches allowed patterns
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (allowedOrigin.includes('*')) {
                const pattern = allowedOrigin.replace('*', '.*');
                return new RegExp(pattern).test(origin);
            }
            return allowedOrigin === origin;
        });
        
        if (isAllowed || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            console.log('⚠️ CORS blocked origin:', origin);
            callback(null, true); // Allow anyway for development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400 // 24 hours
}));

// Handle preflight for all routes
app.options('*', cors());

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`🔥 ${req.method} ${req.path}`);
    if (req.headers.authorization) {
        console.log('🔑 Auth header present');
    }
    next();
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    const admin = require('./api/_firebase-admin');
    res.json({
        status: 'OK',
        message: 'Backend running',
        firebase: admin.apps.length > 0 ? 'Connected' : 'Not initialized',
        timestamp: new Date().toISOString(),
        cors: 'Enabled'
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'EBTracker Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: [
            'GET  /health - Health check',
            'GET  /api/dashboard - Dashboard data',
            'GET  /api/dashboard?stats=true - Statistics',
            'GET  /api/dashboard?role=bdm - Role-specific dashboard',
            'GET  /api/proposals - List all proposals',
            'POST /api/proposals - Create proposal',
            'GET  /api/projects - List projects',
            'POST /api/projects - Create project',
            'GET  /api/projects?action=generate-variation-code - Generate variation code',
            'GET  /api/files - List files',
            'POST /api/files - Upload files',
            'GET  /api/activities - Activity log',
            'GET  /api/tasks - List tasks',
            'POST /api/tasks - Create task',
            'GET  /api/submissions - List submissions',
            'POST /api/submissions - Create submission',
            'GET  /api/payments - List payments',
            'POST /api/payments - Create payment',
            'GET  /api/notifications - List internal notifications',
            'GET  /api/users - List users',
            'POST /api/users - Create user',
            'GET  /api/timesheets - List timesheets',
            'POST /api/timesheets - Log hours',
            'PUT  /api/timesheets - Update timesheet',
            'DELETE /api/timesheets - Delete timesheet',
            'POST /api/variations - Create a new variation',
            'POST /api/email/trigger - Send a Resend email' // <-- NEWLY AVAILABLE
        ]
    });
});

// ============================================
// API ROUTES - Import handlers
// ============================================
console.log('📦 Loading API routes...');

try {
    // Load all route handlers
    const dashboardHandler = require('./api/dashboard');
    const proposalsHandler = require('./api/proposals');
    const projectsHandler = require('./api/projects');
    const tasksHandler = require('./api/tasks');
    const submissionsHandler = require('./api/submissions');
    const paymentsHandler = require('./api/payments');
    const notificationsHandler = require('./api/notifications');
    const activitiesHandler = require('./api/activities');
    const filesHandler = require('./api/files');
    const deliverablesHandler = require('./api/deliverables');
    const usersHandler = require('./api/users');
    const timesheetsHandler = require('./api/timesheets');
    const variationsHandler = require('./api/variations');
    const emailHandler = require('./api/email'); // <-- NEW EMAIL API

    console.log('✅ All handlers loaded successfully');

    // Register routes - ORDER MATTERS for specific routes before general ones
    app.all('/api/dashboard', dashboardHandler);
    app.all('/api/proposals', proposalsHandler);
    app.all('/api/projects', projectsHandler);
    app.all('/api/tasks', tasksHandler);
    app.all('/api/submissions', submissionsHandler);
    app.all('/api/payments', paymentsHandler);
    app.all('/api/notifications', notificationsHandler);
Additional APIs in `server.js` file:
s.js`);
    const usersHandler = require('./api/users');
    const timesheetsHandler = require('./api/timesheets');
    const variationsHandler = require('./api/variations'); // <-- NEW: Import variations handler
    const emailHandler = require('./api/email'); // <-- 1. THIS LINE IS ADDED

    console.log('✅ All handlers loaded successfully');

    // Register routes - ORDER MATTERS for specific routes before general ones
    app.all('/api/dashboard', dashboardHandler);
// ... (all other routes) ...
    app.all('/api/deliverables', deliverablesHandler);
    app.all('/api/users', usersHandler);
    app.all('/api/timesheets', timesheetsHandler);
    app.all('/api/variations', variationsHandler); // <-- NEW: Register variations route
    app.all('/api/email', emailHandler); // <-- 2. THIS LINE IS ADDED

    console.log('✅ All routes registered');

} catch (error) {
    console.error('❌ Error loading routes:', error);
    console.error('Stack:', error.stack);
}
// ... (rest of your server.js file) ...
A `POST /api/email/trigger` endpoint is created in the `api/email.js` file.
This endpoint handles triggering emails via the Resend API based on event types.
const activitiesHandler = require('./api/activities');
    app.all('/api/files', filesHandler);
    app.all('/api/deliverables', deliverablesHandler);
    app.all('/api/users', usersHandler);
    app.all('/api/timesheets', timesheetsHandler);
    app.all('/api/variations', variationsHandler);
    app.all('/api/email', emailHandler); // <-- NEW EMAIL API

    console.log('✅ All routes registered');

} catch (error) {
    console.error('❌ Error loading routes:', error);
    console.error('Stack:', error.stack);
}

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res, next) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        message: `The endpoint ${req.method} ${req.path} does not exist`
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔═══════════════════════════════════════╗');
    console.log(`║  ✅ Server running on port ${PORT}      ║`);
    console.log(`║  🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(20)}║`);
    const admin = require('./api/_firebase-admin');
    console.log(`║  🔥 Firebase: ${(admin.apps.length > 0 ? 'Initialized' : 'Not initialized').padEnd(23)}║`);
    console.log('║  🌐 CORS: Enabled for Vercel         ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log('');
    console.log('📡 API Endpoints ready:');
    console.log('   GET  /health');
    console.log('   GET  /api/dashboard');
    console.log('   GET  /api/proposals');
    console.log('   GET  /api/projects');
    console.log('   GET  /api/activities');
    console.log('   GET  /api/timesheets        ⏱️  NEW');
    console.log('   POST /api/timesheets        ⏱️  NEW');
    console.log('   POST /api/variations        ✨  NEW');
    console.log('   POST /api/email/trigger    📧  NEW');
    console.log('   ... and more');
    console.log('');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
sconnect logic)
    console.log('SIGTERM signal received. Closing HTTP server.');
    server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received. Closing HTTP server.');
    server.close(() => {
  TML content
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });
});

module.exports = app;
