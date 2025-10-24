// api/dashboard.js - Dashboard data handler
const express = require('express');
const router = express.Router();
const admin = require('./_firebase-admin');

// Optional: Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // For development, you might want to skip auth
        console.log('⚠️ No token provided, proceeding without auth');
        return next();
    }

    admin.auth().verifyIdToken(token)
        .then(decodedToken => {
            req.user = decodedToken;
            next();
        })
        .catch(error => {
            console.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        });
};

// GET /api/dashboard - Get dashboard statistics
router.get('/', async (req, res) => {
    try {
        console.log('📊 Dashboard data requested');

        const db = admin.firestore();

        // Initialize counters
        let totalProposals = 0;
        let activeProjects = 0;
        let pendingTasks = 0;
        let totalValue = 0;
        let recentActivities = [];

        try {
            // Get proposals count
            const proposalsSnapshot = await db.collection('proposals').get();
            totalProposals = proposalsSnapshot.size;

            // Calculate total value from proposals
            proposalsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.estimatedValue) {
                    totalValue += parseFloat(data.estimatedValue) || 0;
                }
            });

        } catch (error) {
            console.log('ℹ️ Proposals collection not found or error:', error.message);
        }

        try {
            // Get active projects count
            const projectsSnapshot = await db.collection('projects')
                .where('status', '==', 'active')
                .get();
            activeProjects = projectsSnapshot.size;

        } catch (error) {
            console.log('ℹ️ Projects collection not found or error:', error.message);
        }

        try {
            // Get pending tasks count
            const tasksSnapshot = await db.collection('tasks')
                .where('status', '==', 'pending')
                .get();
            pendingTasks = tasksSnapshot.size;

        } catch (error) {
            console.log('ℹ️ Tasks collection not found or error:', error.message);
        }

        try {
            // Get recent activities (last 10)
            const activitiesSnapshot = await db.collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get();

            activitiesSnapshot.forEach(doc => {
                const data = doc.data();
                recentActivities.push({
                    id: doc.id,
                    description: data.description || data.activity || 'Activity',
                    user: data.user || data.createdBy || 'System',
                    timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
                    status: data.status || 'completed',
                    type: data.type || 'general'
                });
            });

        } catch (error) {
            console.log('ℹ️ Activities collection not found or error:', error.message);
        }

        // Build response
        const dashboardData = {
            success: true,
            data: {
                totalProposals,
                activeProjects,
                pendingTasks,
                totalValue,
                recentActivities,
                lastUpdated: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        };

        console.log('✅ Dashboard data prepared:', {
            proposals: totalProposals,
            projects: activeProjects,
            tasks: pendingTasks,
            activities: recentActivities.length
        });

        res.json(dashboardData);

    } catch (error) {
        console.error('❌ Dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load dashboard',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            data: {
                totalProposals: 0,
                activeProjects: 0,
                pendingTasks: 0,
                totalValue: 0,
                recentActivities: []
            }
        });
    }
});

// GET /api/dashboard/stats - Get specific statistics
router.get('/stats', async (req, res) => {
    try {
        const db = admin.firestore();
        const stats = {};

        // Get counts for different collections
        const collections = ['proposals', 'projects', 'tasks', 'submissions', 'payments'];
        
        for (const collection of collections) {
            try {
                const snapshot = await db.collection(collection).get();
                stats[collection] = snapshot.size;
            } catch (error) {
                stats[collection] = 0;
            }
        }

        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load statistics'
        });
    }
});

// GET /api/dashboard/role/:role - Get role-specific dashboard
router.get('/role/:role', async (req, res) => {
    try {
        const { role } = req.params;
        const db = admin.firestore();

        console.log(`📊 Loading dashboard for role: ${role}`);

        // Customize data based on role
        let dashboardData = {
            success: true,
            role: role,
            data: {},
            timestamp: new Date().toISOString()
        };

        switch (role) {
            case 'estimator':
                // Get proposals assigned to estimator
                const estimatorProposals = await db.collection('proposals')
                    .where('status', 'in', ['pending', 'in_review'])
                    .get();
                
                dashboardData.data = {
                    pendingProposals: estimatorProposals.size,
                    message: 'Estimator dashboard'
                };
                break;

            case 'coo':
            case 'director':
                // Get overview of everything
                const allProposals = await db.collection('proposals').get();
                const allProjects = await db.collection('projects').get();
                
                dashboardData.data = {
                    totalProposals: allProposals.size,
                    totalProjects: allProjects.size,
                    message: 'Executive dashboard'
                };
                break;

            case 'designer':
            case 'design_lead':
                // Get design tasks
                const designTasks = await db.collection('tasks')
                    .where('department', '==', 'design')
                    .get();
                
                dashboardData.data = {
                    designTasks: designTasks.size,
                    message: 'Design dashboard'
                };
                break;

            case 'accounts':
                // Get payment and financial data
                const payments = await db.collection('payments').get();
                
                dashboardData.data = {
                    totalPayments: payments.size,
                    message: 'Accounts dashboard'
                };
                break;

            default:
                dashboardData.data = {
                    message: 'Generic dashboard'
                };
        }

        res.json(dashboardData);

    } catch (error) {
        console.error('Role dashboard error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load role-specific dashboard'
        });
    }
});

module.exports = router;
