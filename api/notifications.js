// api/notifications.js
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
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
        
        if (req.method === 'GET') {
            const { unreadOnly, limit = 20 } = req.query;
            const userRole = req.user.role;
            const userUid = req.user.uid;
            
            let query = db.collection('notifications')
                .orderBy('createdAt', 'desc')
                .limit(parseInt(limit));
            
            // Filter notifications based on role
            query = query.where('recipientRole', '==', userRole);
            
            // For BDMs, also check specific UID-based notifications
            if (userRole === 'bdm') {
                const specificNotifications = await db.collection('notifications')
                    .where('recipientUid', '==', userUid)
                    .orderBy('createdAt', 'desc')
                    .limit(parseInt(limit))
                    .get();
                    
                const roleNotifications = await query.get();
                
                const allNotifications = [
                    ...specificNotifications.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                    ...roleNotifications.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                ].sort((a, b) => b.createdAt - a.createdAt).slice(0, parseInt(limit));
                
                if (unreadOnly === 'true') {
                    const filtered = allNotifications.filter(n => !n.isRead);
                    return res.status(200).json({ success: true, data: filtered });
                }
                
                return res.status(200).json({ success: true, data: allNotifications });
            }
            
            if (unreadOnly === 'true') {
                query = query.where('isRead', '==', false);
            }
            
            const snapshot = await query.get();
            const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            return res.status(200).json({ success: true, data: notifications });
        }
        
        if (req.method === 'POST') {
            // Create notification (for system use)
            const { 
                type, 
                recipientRole, 
                recipientUid, 
                message, 
                projectId, 
                proposalId,
                priority = 'normal'
            } = req.body;
            
            const notificationData = {
                type,
                recipientRole,
                recipientUid: recipientUid || null,
                message,
                projectId: projectId || null,
                proposalId: proposalId || null,
                priority,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                createdBy: req.user.name,
                createdByRole: req.user.role,
                isRead: false
            };
            
            const docRef = await db.collection('notifications').add(notificationData);
            
            return res.status(201).json({ 
                success: true, 
                data: { id: docRef.id, ...notificationData } 
            });
        }
        
        if (req.method === 'PUT') {
            // Mark notification as read
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Notification ID required' 
                });
            }
            
            const notificationRef = db.collection('notifications').doc(id);
            const notificationDoc = await notificationRef.get();
            
            if (!notificationDoc.exists) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Notification not found' 
                });
            }
            
            await notificationRef.update({
                isRead: true,
                readAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Notification marked as read' 
            });
        }
        
        if (req.method === 'DELETE') {
            // Clear all notifications for user
            const userRole = req.user.role;
            const userUid = req.user.uid;
            
            let batch = db.batch();
            let count = 0;
            
            // Get notifications for this role
            const roleNotifications = await db.collection('notifications')
                .where('recipientRole', '==', userRole)
                .get();
                
            roleNotifications.forEach(doc => {
                batch.delete(doc.ref);
                count++;
            });
            
            // For BDMs, also delete UID-specific notifications
            if (userRole === 'bdm') {
                const uidNotifications = await db.collection('notifications')
                    .where('recipientUid', '==', userUid)
                    .get();
                    
                uidNotifications.forEach(doc => {
                    batch.delete(doc.ref);
                    count++;
                });
            }
            
            if (count > 0) {
                await batch.commit();
            }
            
            return res.status(200).json({ 
                success: true, 
                message: `${count} notifications cleared` 
            });
        }
        
        return res.status(405).json({ success: false, error: 'Method not allowed' });
        
    } catch (error) {
        console.error('Notifications API error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

module.exports = allowCors(handler);