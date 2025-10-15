// server.js - Complete backend entry point
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
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// CORS - Allow all origins
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight for all routes
app.options('*', cors());

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
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
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'EBTracker Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: [
            'GET  /health - Health check',
            'GET  /api/proposals - List all proposals',
            'POST /api/proposals - Create proposal',
            'GET  /api/dashboard - Dashboard data',
            'GET  /api/files - List files',
            'POST /api/files - Upload files',
            'GET  /api/activities - Activity log',
            'GET  /api/tasks - List tasks',
            'GET  /api/submissions - List submissions',
            'GET  /api/payments - List payments',
            'GET  /api/notifications - List notifications',
            'GET  /api/projects - List projects'
        ]
    });
});

// ============================================
// API ROUTES - Import handlers
// ============================================
console.log('📦 Loading API routes...');

try {
    // Load all route handlers
    const proposalsHandler = require('./api/proposals');
    const filesHandler = require('./api/files');
    const dashboardHandler = require('./api/dashboard');
    const activitiesHandler = require('./api/activities');
    const tasksHandler = require('./api/tasks');
    const submissionsHandler = require('./api/submissions');
    const paymentsHandler = require('./api/payments');
    const notificationsHandler = require('./api/notifications');
    const projectsHandler = require('./api/projects');
    
    console.log('✅ All handlers loaded successfully');
    
    // Register routes
    app.use('/api/proposals', proposalsHandler);
    app.use('/api/files', filesHandler);
    app.use('/api/dashboard', dashboardHandler);
    app.use('/api/activities', activitiesHandler);
    app.use('/api/tasks', tasksHandler);
    app.use('/api/submissions', submissionsHandler);
    app.use('/api/payments', paymentsHandler);
    app.use('/api/notifications', notificationsHandler);
    app.use('/api/projects', projectsHandler);
    
    console.log('✅ All routes registered');
    
} catch (error) {
    console.error('❌ Error loading routes:', error);
    console.error('Stack:', error.stack);
}

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint not found',
        path: req.path,
        method: req.method
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
// GRACEFUL SHUTDOWN
// ============================================
const server = app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✅ Server running on port', PORT);
    console.log('📍 Environment:', process.env.NODE_ENV || 'development');
    const admin = require('./api/_firebase-admin');
    console.log('🔥 Firebase:', admin.apps.length > 0 ? 'Initialized' : 'Not initialized');
    console.log('═══════════════════════════════════════');
    console.log('');
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server.');
    server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });
});

module.exports = app;
