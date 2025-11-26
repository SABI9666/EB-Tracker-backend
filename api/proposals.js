// api/proposals.js - UPDATED WITH TONNAGE TRACKING FOR ALLOCATION LOGIC
const admin = require('./_firebase-admin');
const { verifyToken } = require('../middleware/auth');
const util = require('util');
const { sendEmailNotification } = require('./email');

const db = admin.firestore();
const bucket = admin.storage().bucket();

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

        // Parse JSON body for POST/PUT
        if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] === 'application/json') {
            if (!req.body || Object.keys(req.body).length === 0) {
                await new Promise((resolve) => {
                    const chunks = [];
                    req.on('data', (chunk) => chunks.push(chunk));
                    req.on('end', () => {
                        try {
                            const bodyBuffer = Buffer.concat(chunks);
                            req.body = bodyBuffer.length > 0 ? JSON.parse(bodyBuffer.toString()) : {};
                        } catch (e) {
                            console.error("Error parsing JSON body:", e);
                            req.body = {};
                        }
                        resolve();
                    });
                });
            }
        }

        // ============================================
        // GET - Retrieve proposals
        // ============================================
        if (req.method === 'GET') {
            const { id } = req.query;
            
            if (id) {
                // Get single proposal
                const doc = await db.collection('proposals').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Proposal not found' });
                }
                
                const proposalData = doc.data();
                
                // BDM isolation
                if (req.user.role === 'bdm' && proposalData.createdByUid !== req.user.uid) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Access denied. You can only view your own proposals.' 
                    });
                }

                // Design Lead isolation
                if (req.user.role === 'design_lead') {
                    if (!proposalData.projectCreated || !proposalData.projectId) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal has not been converted to a project yet.' 
                        });
                    }
                    const projectDoc = await db.collection('projects').doc(proposalData.projectId).get();
                    if (!projectDoc.exists || projectDoc.data().designLeadUid !== req.user.uid) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal is not allocated to you.' 
                        });
                    }
                }

                // Designer isolation
                if (req.user.role === 'designer') {
                    if (!proposalData.projectCreated || !proposalData.projectId) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal has not been converted to a project yet.' 
                        });
                    }
                    const projectDoc = await db.collection('projects').doc(proposalData.projectId).get();
                    if (!projectDoc.exists || !(projectDoc.data().assignedDesignerUids || []).includes(req.user.uid)) {
                        return res.status(403).json({ 
                            success: false, 
                            error: 'This proposal is not assigned to you.' 
                        });
                    }
                }
                
                return res.status(200).json({ 
                    success: true, 
                    data: { id: doc.id, ...proposalData }
                });
            }
            
            // Get all proposals (filtered by role)
            let query = db.collection('proposals').orderBy('createdAt', 'desc');
            
            // BDM: Only their proposals
            if (req.user.role === 'bdm') {
                query = query.where('createdByUid', '==', req.user.uid);
            }
            
            const snapshot = await query.get();
            const proposals = [];
            
            for (const doc of snapshot.docs) {
                const proposalData = doc.data();
                
                // Design Lead: Only show proposals that became projects allocated to them
                if (req.user.role === 'design_lead') {
                    if (proposalData.projectCreated && proposalData.projectId) {
                        try {
                            const projectDoc = await db.collection('projects').doc(proposalData.projectId).get();
                            if (projectDoc.exists && projectDoc.data().designLeadUid === req.user.uid) {
                                proposals.push({ id: doc.id, ...proposalData });
                            }
                        } catch (err) {
                            console.error('Error checking project for design lead:', err);
                        }
                    }
                } 
                // Designer: Only show proposals that became projects assigned to them
                else if (req.user.role === 'designer') {
                    if (proposalData.projectCreated && proposalData.projectId) {
                        try {
                            const projectDoc = await db.collection('projects').doc(proposalData.projectId).get();
                            if (projectDoc.exists && (projectDoc.data().assignedDesignerUids || []).includes(req.user.uid)) {
                                proposals.push({ id: doc.id, ...proposalData });
                            }
                        } catch (err) {
                            console.error('Error checking project for designer:', err);
                        }
                    }
                }
                // Other roles: Show all proposals
                else {
                    proposals.push({ id: doc.id, ...proposalData });
                }
            }
            
            return res.status(200).json({ 
                success: true, 
                data: proposals 
            });
        }

        // ============================================
        // POST - Create new proposal
        // ============================================
        if (req.method === 'POST') {
            // Only BDM can create proposals
            if (req.user.role !== 'bdm') {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Only BDM can create proposals' 
                });
            }

            const proposalData = {
                ...req.body,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                createdBy: req.user.email,
                createdByName: req.user.name,
                createdByUid: req.user.uid,
                status: 'draft',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('proposals').add(proposalData);
            
            await db.collection('activities').add({
                type: 'proposal_created',
                details: `New proposal created: ${req.body.projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: docRef.id,
                projectName: req.body.projectName
            });

            return res.status(201).json({ 
                success: true, 
                id: docRef.id,
                message: 'Proposal created successfully' 
            });
        }

        // ============================================
        // PUT - Update proposal
        // ============================================
        if (req.method === 'PUT') {
            const { id } = req.query;
            const { action, data } = req.body;
            
            if (!id) return res.status(400).json({ success: false, error: 'Missing proposal ID' });
            if (!action) return res.status(400).json({ success: false, error: 'Missing action parameter' });
            
            const proposalRef = db.collection('proposals').doc(id);
            const proposalDoc = await proposalRef.get();
            
            if (!proposalDoc.exists) return res.status(404).json({ success: false, error: 'Proposal not found' });
            
            const proposal = proposalDoc.data();
            let updates = {};
            let activityDetail = '';
            
            switch (action) {
                case 'add_estimation':
                    if (req.user.role !== 'estimator') {
                        return res.status(403).json({ success: false, error: 'Only Estimators can add estimation' });
                    }
                    
                    // Validate: Must have either manhours OR tonnage (or both)
                    const manhours = parseFloat(data.manhours) || parseFloat(data.totalHours) || 0;
                    const tonnage = parseFloat(data.tonnage) || 0;
                    
                    if (!data || (manhours === 0 && tonnage === 0)) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Missing estimation data: Please provide either manhours or tonnage' 
                        });
                    }
                    
                    if (!data.services || data.services.length === 0) {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Please select at least one service' 
                        });
                    }
                    
                    // Store breakdown if provided
                    const breakdown = {
                        designHours: parseFloat(data.designHours) || 0,
                        detailingHours: parseFloat(data.detailingHours) || 0,
                        checkingHours: parseFloat(data.checkingHours) || 0,
                        revisionHours: parseFloat(data.revisionHours) || 0,
                        pmHours: parseFloat(data.pmHours) || 0
                    };
                    
                    // ============================================
                    // ✅ CRITICAL FIX: Track if tonnage was used
                    // ============================================
                    const usedTonnageForDesign = data.usedTonnageForDesign || false;
                    const tonnageValue = usedTonnageForDesign ? tonnage : null;
                    
                    updates = {
                        estimation: {
                            manhours: manhours,
                            totalHours: manhours, // Also store as totalHours for compatibility
                            tonnage: tonnage,
                            
                            // ✅ NEW CRITICAL FIELDS
                            usedTonnageForDesign: usedTonnageForDesign,  // Boolean flag
                            tonnageValue: tonnageValue,                   // Actual tonnage if used
                            
                            services: data.services || [],
                            estimatedBy: req.user.email,
                            estimatorName: req.user.name,
                            estimatedAt: admin.firestore.FieldValue.serverTimestamp(),
                            breakdown: breakdown,
                            notes: data.notes || ''
                        },
                        status: 'estimated'
                    };
                    
                    // Create activity detail based on what was provided
                    if (manhours > 0 && tonnage > 0) {
                        activityDetail = `Estimation added: ${manhours} manhours, ${tonnage} tons${usedTonnageForDesign ? ' (tonnage-based)' : ''}`;
                    } else if (manhours > 0) {
                        activityDetail = `Estimation added: ${manhours} manhours`;
                    } else {
                        activityDetail = `Estimation added: ${tonnage} tons`;
                    }
                    
                    // Log tonnage usage for debugging
                    if (usedTonnageForDesign) {
                        console.log(`📊 Estimation with TONNAGE: ${tonnageValue} tons → ${manhours} hours calculated`);
                    } else {
                        console.log(`📊 Estimation with HOURS: ${manhours} hours (direct entry)`);
                    }
                    
                    try {
                        const cooSnapshot = await db.collection('users').where('role', '==', 'coo').limit(1).get();
                        if (!cooSnapshot.empty) {
                            const cooEmail = cooSnapshot.docs[0].data().email;
                            sendEmailNotification('estimation.complete', {
                                projectName: proposal.projectName,
                                estimatedBy: req.user.name,
                                manhours: data.manhours,
                                date: new Date().toLocaleDateString(),
                                cooEmail: cooEmail
                            }).catch(e => console.error('Email failed:', e.message));
                        }
                    } catch (e) { console.error('Error preparing estimation email:', e.message); }
                    
                    await db.collection('notifications').add({
                        type: 'estimation_complete',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Estimation completed for "${proposal.projectName}" by ${req.user.name}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;

                case 'add_pricing':
                    if (req.user.role !== 'coo') {
                        return res.status(403).json({ success: false, error: 'Only COO can add pricing' });
                    }
                    if (!data || !data.projectNumber || !data.quoteValue) {
                        return res.status(400).json({ success: false, error: 'Missing pricing data' });
                    }
                    updates = {
                        pricing: {
                            projectNumber: data.projectNumber,
                            quoteValue: parseFloat(data.quoteValue),
                            currency: data.currency || 'USD',
                            hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : null,
                            profitMargin: data.profitMargin ? parseFloat(data.profitMargin) : null,
                            notes: data.notes || '',
                            costBreakdown: data.costBreakdown || {},
                            pricedBy: req.user.email,
                            pricedByName: req.user.name,
                            pricedAt: admin.firestore.FieldValue.serverTimestamp()
                        },
                        status: 'pricing_complete'
                    };
                    activityDetail = `Pricing added: ${data.currency} ${data.quoteValue} (Project #: ${data.projectNumber})`;
                    
                    try {
                        const directorSnapshot = await db.collection('users').where('role', '==', 'director').limit(1).get();
                        if (!directorSnapshot.empty) {
                            const directorEmail = directorSnapshot.docs[0].data().email;
                            sendEmailNotification('pricing.complete', {
                                projectName: proposal.projectName,
                                quoteValue: `${data.currency} ${data.quoteValue}`,
                                projectNumber: data.projectNumber,
                                pricedBy: req.user.name,
                                date: new Date().toLocaleDateString(),
                                directorEmail: directorEmail
                            }).catch(e => console.error('Pricing email failed:', e.message));
                        }
                    } catch (e) { console.error('Error preparing pricing email:', e.message); }
                    
                    await db.collection('notifications').add({
                        type: 'pricing_complete',
                        recipientRole: 'director',
                        proposalId: id,
                        message: `Pricing completed for "${proposal.projectName}" by ${req.user.name}`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;

                case 'update_pricing':
                    // Allow COO/Director to edit existing pricing
                    if (!['coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ success: false, error: 'Only COO or Director can update pricing' });
                    }
                    
                    if (!data || !data.projectNumber || !data.quoteValue) {
                        return res.status(400).json({ success: false, error: 'Missing required pricing fields' });
                    }

                    // Check if proposal has pricing
                    if (!proposal.pricing) {
                        return res.status(400).json({ success: false, error: 'No existing pricing to update. Use add_pricing instead.' });
                    }
                    
                    // Check if proposal can be edited (not if it's already won/lost/allocated)
                    if (proposal.status === 'won' || proposal.status === 'lost') {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Cannot edit pricing for won/lost proposals' 
                        });
                    }
                    
                    if (proposal.allocationStatus === 'allocated') {
                        return res.status(400).json({ 
                            success: false, 
                            error: 'Cannot edit pricing after project allocation' 
                        });
                    }

                    // Update pricing information
                    updates = {
                        pricing: {
                            projectNumber: data.projectNumber,
                            quoteValue: parseFloat(data.quoteValue),
                            currency: data.currency || 'USD',
                            hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : null,
                            profitMargin: data.profitMargin ? parseFloat(data.profitMargin) : null,
                            notes: data.notes || '',
                            costBreakdown: data.costBreakdown || {},
                            pricedBy: proposal.pricing.pricedBy || req.user.email,
                            pricedByName: proposal.pricing.pricedByName || req.user.name,
                            pricedAt: proposal.pricing.pricedAt || admin.firestore.FieldValue.serverTimestamp(),
                            lastEditedBy: req.user.email,
                            lastEditedByName: req.user.name,
                            lastEditedAt: admin.firestore.FieldValue.serverTimestamp()
                        }
                    };

                    activityDetail = `Pricing updated: ${data.currency} ${data.quoteValue} (Project #: ${data.projectNumber}) by ${req.user.name}`;
                    break;

                case 'mark_won':
                    if (!['coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ success: false, error: 'Only COO or Director can mark proposals as won' });
                    }
                    updates = { status: 'won' };
                    activityDetail = `Proposal marked as WON by ${req.user.name}`;
                    
                    await db.collection('notifications').add({
                        type: 'proposal_won',
                        recipientRole: 'coo',
                        proposalId: id,
                        message: `Proposal "${proposal.projectName}" has been marked as WON`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'high'
                    });
                    break;

                case 'mark_lost':
                    if (!['coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ success: false, error: 'Only COO or Director can mark proposals as lost' });
                    }
                    updates = { 
                        status: 'lost',
                        lostReason: data.reason || 'Not specified'
                    };
                    activityDetail = `Proposal marked as LOST by ${req.user.name}`;
                    break;

                case 'send_to_client':
                    if (!['coo', 'director'].includes(req.user.role)) {
                        return res.status(403).json({ success: false, error: 'Only COO or Director can send proposals to clients' });
                    }
                    updates = { 
                        status: 'sent_to_client',
                        sentToClientAt: admin.firestore.FieldValue.serverTimestamp(),
                        sentToClientBy: req.user.name
                    };
                    activityDetail = `Proposal sent to client by ${req.user.name}`;
                    
                    await db.collection('notifications').add({
                        type: 'proposal_sent_to_client',
                        recipientRole: 'bdm',
                        recipientUid: proposal.createdByUid,
                        proposalId: id,
                        message: `Proposal "${proposal.projectName}" has been sent to the client`,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false,
                        priority: 'normal'
                    });
                    break;

                default:
                    return res.status(400).json({ 
                        success: false, 
                        error: `Unknown action: ${action}` 
                    });
            }
            
            // Apply updates
            updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
            await proposalRef.update(updates);
            
            // Log activity
            if (activityDetail) {
                await db.collection('activities').add({
                    type: `proposal_${action}`,
                    details: activityDetail,
                    performedByName: req.user.name,
                    performedByRole: req.user.role,
                    performedByUid: req.user.uid,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    proposalId: id,
                    projectName: proposal.projectName
                });
            }
            
            return res.status(200).json({ 
                success: true, 
                message: 'Proposal updated successfully' 
            });
        }

        // ============================================
        // DELETE - Delete proposal
        // ============================================
        if (req.method === 'DELETE') {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Missing proposal ID' });
            }
            
            const proposalRef = db.collection('proposals').doc(id);
            const proposalDoc = await proposalRef.get();
            
            if (!proposalDoc.exists) {
                return res.status(404).json({ success: false, error: 'Proposal not found' });
            }
            
            const proposal = proposalDoc.data();
            
            // Only BDM (who created it) or COO/Director can delete
            if (req.user.role === 'bdm' && proposal.createdByUid !== req.user.uid) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'You can only delete your own proposals' 
                });
            }
            
            if (!['bdm', 'coo', 'director'].includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Insufficient permissions to delete proposals' 
                });
            }
            
            // Don't allow deletion if project was created from it
            if (proposal.projectCreated && proposal.projectId) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Cannot delete proposal that has been converted to a project' 
                });
            }
            
            await proposalRef.delete();
            
            await db.collection('activities').add({
                type: 'proposal_deleted',
                details: `Proposal deleted: ${proposal.projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                proposalId: id,
                projectName: proposal.projectName
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Proposal deleted successfully' 
            });
        }

        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });

    } catch (error) {
        console.error('Error in proposals handler:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

module.exports = allowCors(handler);
