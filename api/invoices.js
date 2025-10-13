// api/invoices.js
const express = require('express');
const router = express.Router();
const admin = require('./_firebase-admin');
const { authenticateToken } = require('./_auth-middleware');

const db = admin.firestore();

// Get all invoices
router.get('/', authenticateToken, async (req, res) => {
    try {
        const invoicesSnapshot = await db.collection('invoices').get();
        const invoices = invoicesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        res.json({ success: true, data: invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single invoice
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const doc = await db.collection('invoices').doc(req.params.id).get();
        
        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'Invoice not found' });
        }
        
        res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create invoice
router.post('/', authenticateToken, async (req, res) => {
    try {
        const invoiceData = {
            ...req.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: req.user.uid
        };
        
        const docRef = await db.collection('invoices').add(invoiceData);
        
        res.json({ success: true, data: { id: docRef.id } });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
