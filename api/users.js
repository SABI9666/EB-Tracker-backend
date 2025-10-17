// api/users.js - User management with role-based access
const admin = require('./_firebase-admin');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validateRole } = require('../middleware/roleValidation');
const util = require('util');

const db = admin.firestore();

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

const handler = async (req, res) => {
    try {
        await util.promisify(verifyToken)(req, res);
        
        // GET - List users (restricted by role)
        if (req.method === 'GET') {
            const { role, status } = req.query;
            
            let query = db.collection('users');
            
            // Filter by role if specified
            if (role && validateRole(role)) {
                query = query.where('role', '==', role);
            }
            
            // Filter by status
            if (status) {
                query = query.where('status', '==', status);
            }
            
            // Apply role-based filtering
            if (req.user.role === 'design_lead') {
                // Design leads can only see designers
                query = query.where('role', '==', 'designer');
            } else if (!['coo', 'director'].includes(req.user.role)) {
                // Other roles can only see themselves
                return res.status(200).json({
                    success: true,
                    data: [{
                        uid: req.user.uid,
                        name: req.user.name,
                        email: req.user.email,
                        role: req.user.role
                    }]
                });
            }
            
            const snapshot = await query.get();
            const users = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data(),
                // Don't send sensitive data
                password: undefined
            }));
            
            return res.status(200).json({ success: true, data: users });
        }
        
        // PUT - Update user (only admins or self)
        if (req.method === 'PUT') {
            const { uid } = req.query;
            const updates = req.body;
            
            if (!uid) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'User ID required' 
                });
            }
            
            // Check permissions
            const isSelf = uid === req.user.uid;
            const isAdmin = ['coo', 'director'].includes(req.user.role);
            
            if (!isSelf && !isAdmin) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Insufficient permissions to update user' 
                });
            }
            
            // Restrict what can be updated
            const allowedUpdates = isSelf 
                ? ['name', 'phone', 'department'] 
                : ['name', 'phone', 'department', 'role', 'status'];
            
            const filteredUpdates = {};
            for (const key of allowedUpdates) {
                if (updates[key] !== undefined) {
                    filteredUpdates[key] = updates[key];
                }
            }
            
            // Validate role if being updated
            if (filteredUpdates.role && !validateRole(filteredUpdates.role)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid role specified' 
                });
            }
            
            filteredUpdates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            
            await db.collection('users').doc(uid).update(filteredUpdates);
            
            return res.status(200).json({ 
                success: true, 
                message: 'User updated successfully' 
            });
        }
        
        // POST - Create user (only admins)
        if (req.method === 'POST') {
            // Use requireRole middleware
            await util.promisify(requireRole(['coo', 'director']))(req, res, () => {});
            
            const { email, name, role, password } = req.body;
            
            if (!email || !name || !role) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Missing required fields' 
                });
            }
            
            if (!validateRole(role)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Invalid role' 
                });
            }
            
            try {
                // Create auth user
                const userRecord = await admin.auth().createUser({
                    email,
                    password: password || 'TempPassword123!',
                    displayName: name
                });
                
                // Create Firestore user document
                await db.collection('users').doc(userRecord.uid).set({
                    name,
                    email,
                    role,
                    status: 'active',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    createdBy: req.user.uid
                });
                
                return res.status(201).json({ 
                    success: true, 
                    data: { uid: userRecord.uid },
                    message: 'User created successfully' 
                });
                
            } catch (error) {
                return res.status(400).json({ 
                    success: false, 
                    error: error.message 
                });
            }
        }
        
        return res.status(405).json({ success: false, error: 'Method not allowed' });
        
    } catch (error) {
        console.error('Users API error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

module.exports = allowCors(handler);
