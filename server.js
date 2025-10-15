// server.js - Main backend entry point for Render deployment
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

// CORS Configuration - Allow all origins for now
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// HEALTH CHECK ENDPOINT
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
        endpoints: [
            '/health - Health check',
            '/api/proposals - Proposals management',
            '/api/files - File management',
            '/api/dashboard - Dashboard data',
            '/api/activities - Activity log'
        ]
    });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/proposals', require('./api/proposals'));
app.use('/api/files', require('./api/files'));
app.use('/api/dashboard', require('./api/dashboard'));
app.use('/api/activities', require('./api/activities'));
app.use('/api/tasks', require('./api/tasks'));
app.use('/api/submissions', require('./api/submissions'));
app.use('/api/payments', require('./api/payments'));
app.use('/api/notifications', require('./api/notifications'));
app.use('/api/projects', require('./api/projects'));

// ============================================
// ERROR HANDLING
// ============================================
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint not found',
        path: req.path 
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔥 Firebase: ${require('./api/_firebase-admin').apps.length > 0 ? 'Initialized' : 'Not initialized'}`);
});

module.exports = app;
