// api/timesheets.js - Timesheet management for designers with additional time requests
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
        // GET - Retrieve timesheets
        // ============================================
        if (req.method === 'GET') {
            const { projectId, designerUid, id, action } = req.query;
            
            // Get executive dashboard analytics
            if (action === 'executive_dashboard') {
                if (!['coo', 'director'].includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'Only COO/Director can access executive dashboard' 
                    });
                }

                // Get all projects with their timesheet data
                const projectsSnapshot = await db.collection('projects')
                    .where('status', 'in', ['assigned', 'in_progress', 'completed'])
                    .get();
                
                const projects = [];
                const designersMap = new Map();
                let totalProjects = 0;
                let projectsWithTimeline = 0;
                let projectsAboveTimeline = 0;
                let totalExceededHours = 0;

                for (const projectDoc of projectsSnapshot.docs) {
                    const project = { id: projectDoc.id, ...projectDoc.data() };
                    
                    // Get timesheets for this project
                    const timesheetsSnapshot = await db.collection('timesheets')
                        .where('projectId', '==', project.id)
                        .get();
                    
                    const hoursLogged = timesheetsSnapshot.docs.reduce((sum, doc) => {
                        return sum + (doc.data().hours || 0);
                    }, 0);
                    
                    const allocatedHours = project.allocatedHours || 0;
                    const isExceeded = hoursLogged > allocatedHours && allocatedHours > 0;
                    const exceededBy = isExceeded ? hoursLogged - allocatedHours : 0;
                    
                    totalProjects++;
                    if (allocatedHours > 0) projectsWithTimeline++;
                    if (isExceeded) {
                        projectsAboveTimeline++;
                        totalExceededHours += exceededBy;
                    }
                    
                    projects.push({
                        id: project.id,
                        projectName: project.projectName,
                        projectCode: project.projectCode,
                        clientCompany: project.clientCompany,
                        allocatedHours: allocatedHours,
                        hoursLogged: hoursLogged,
                        percentageUsed: allocatedHours > 0 ? (hoursLogged / allocatedHours * 100).toFixed(1) : 0,
                        isExceeded: isExceeded,
                        exceededBy: exceededBy,
                        status: project.status,
                        designLeadName: project.designLeadName,
                        assignedDesigners: project.assignedDesigners || []
                    });
                    
                    // Collect designer data
                    timesheetsSnapshot.docs.forEach(doc => {
                        const timesheet = doc.data();
                        if (!designersMap.has(timesheet.designerUid)) {
                            designersMap.set(timesheet.designerUid, {
                                uid: timesheet.designerUid,
                                name: timesheet.designerName,
                                email: timesheet.designerEmail,
                                totalHours: 0,
                                projectsWorkedOn: new Set()
                            });
                        }
                        const designer = designersMap.get(timesheet.designerUid);
                        designer.totalHours += timesheet.hours || 0;
                        designer.projectsWorkedOn.add(project.id);
                    });
                }
                
                // Convert designers map to array
                const designers = Array.from(designersMap.values()).map(d => ({
                    ...d,
                    projectsWorkedOn: d.projectsWorkedOn.size
                }));
                
                // Calculate analytics
                const exceededProjects = projects.filter(p => p.isExceeded);
                const withinTimelineProjects = projects.filter(p => 
                    !p.isExceeded && p.allocatedHours > 0 && p.hoursLogged > 0
                );
                
                return res.status(200).json({
                    success: true,
                    data: {
                        metrics: {
                            totalProjects,
                            projectsWithTimeline,
                            projectsAboveTimeline,
                            totalExceededHours: totalExceededHours.toFixed(1),
                            averageHoursPerProject: totalProjects > 0 
                                ? (projects.reduce((sum, p) => sum + p.hoursLogged, 0) / totalProjects).toFixed(1) 
                                : 0
                        },
                        projects: projects.sort((a, b) => b.percentageUsed - a.percentageUsed),
                        designers: designers.sort((a, b) => b.totalHours - a.totalHours),
                        analytics: {
                            exceededProjects,
                            withinTimelineProjects,
                            projectsAboveTimeline: exceededProjects,
                            designerDuration: designers.map(d => ({
                                name: d.name,
                                totalHours: d.totalHours,
                                projectCount: d.projectsWorkedOn
                            }))
                        }
                    }
                });
            }
            
            // Get single timesheet entry
            if (id) {
                const doc = await db.collection('timesheets').doc(id).get();
                if (!doc.exists) {
                    return res.status(404).json({ success: false, error: 'Timesheet entry not found' });
                }
                return res.status(200).json({ success: true, data: { id: doc.id, ...doc.data() } });
            }
            
            // Get timesheets for a project
            let query = db.collection('timesheets').orderBy('date', 'desc');
            
            if (projectId) {
                query = query.where('projectId', '==', projectId);
            }
            
            // Designers can only see their own timesheets
            if (req.user.role === 'designer') {
                query = query.where('designerUid', '==', req.user.uid);
            } else if (designerUid) {
                // Design Lead/COO can filter by designer
                query = query.where('designerUid', '==', designerUid);
            }
            
            const snapshot = await query.limit(100).get();
            const timesheets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Calculate total hours for each project
            const projectHours = {};
            timesheets.forEach(entry => {
                if (!projectHours[entry.projectId]) {
                    projectHours[entry.projectId] = 0;
                }
                projectHours[entry.projectId] += entry.hours || 0;
            });
            
            return res.status(200).json({ 
                success: true, 
                data: timesheets,
                summary: { projectHours }
            });
        }

        // ============================================
        // POST - Create timesheet entry
        // ============================================
        if (req.method === 'POST') {
            const { projectId, date, hours, description, taskId } = req.body;
            
            // Validation
            if (!projectId) {
                return res.status(400).json({ success: false, error: 'Project ID is required' });
            }
            
            if (!date) {
                return res.status(400).json({ success: false, error: 'Date is required' });
            }
            
            if (!hours || hours <= 0) {
                return res.status(400).json({ success: false, error: 'Hours must be greater than 0' });
            }
            
            if (hours > 24) {
                return res.status(400).json({ success: false, error: 'Hours cannot exceed 24 per day' });
            }
            
            // Get project to check allocation
            const projectDoc = await db.collection('projects').doc(projectId).get();
            if (!projectDoc.exists) {
                return res.status(404).json({ success: false, error: 'Project not found' });
            }
            
            const project = projectDoc.data();
            
            // Check if user is assigned to project
            if (req.user.role === 'designer') {
                if (!project.assignedDesigners || !project.assignedDesigners.includes(req.user.uid)) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'You are not assigned to this project' 
                    });
                }
            }
            
            // Calculate total hours logged for this project by this designer
            const existingTimesheets = await db.collection('timesheets')
                .where('projectId', '==', projectId)
                .where('designerUid', '==', req.user.uid)
                .get();
            
            const totalHours = existingTimesheets.docs.reduce((sum, doc) => {
                return sum + (doc.data().hours || 0);
            }, 0);
            
            const newTotal = totalHours + hours;
            let requestUsed = null; // Will store ID of approved request if used
            
            // ============================================
            // START: REPLACEMENT BLOCK
            // ============================================
            // Check if exceeds allocated hours
            const allocatedHours = project.allocatedHours || 0;
            if (allocatedHours > 0 && newTotal > allocatedHours) {
                // Check if designer has an approved time request for this project
                const approvedRequestSnapshot = await db.collection('timeRequests')
                    .where('projectId', '==', projectId)
                    .where('designerUid', '==', req.user.uid)
                    .where('status', '==', 'approved')
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get();
                                
                let canProceed = false;
                // requestUsed is already defined outside this block
                                
                if (!approvedRequestSnapshot.empty) {
                    const approvedRequest = approvedRequestSnapshot.docs[0];
                    const requestData = approvedRequest.data();
                                        
                    // Check if the approved hours cover this submission
                    const newAllocatedHours = project.allocatedHours; // Already updated by approval
                    if (newTotal <= newAllocatedHours) {
                        canProceed = true;
                        requestUsed = approvedRequest.id;
                                                
                        // Mark the request as used
                        await approvedRequest.ref.update({
                            status: 'used',
                            usedAt: admin.firestore.FieldValue.serverTimestamp(),
                            updatedAt: admin.firestore.FieldValue.serverTimestamp()
                        });
                    }
                }
                                
                if (!canProceed) {
                    return res.status(400).json({ 
                        success: false, 
                        error: `Hours exceed allocation. Allocated: ${allocatedHours}h, Used: ${totalHours}h, Trying to add: ${hours}h`,
                        exceedsAllocation: true,
                        totalHours,
                        allocatedHours,
                        remainingHours: allocatedHours - totalHours,
                        exceededBy: newTotal - allocatedHours,
                        projectId,
                        projectName: project.projectName
                    });
                }
            }
            // ============================================
            // END: REPLACEMENT BLOCK
            // ============================================

            
            // Create timesheet entry
            const timesheetData = {
                projectId,
                projectName: project.projectName,
                designerUid: req.user.uid,
                designerName: req.user.name,
                designerEmail: req.user.email,
                date: admin.firestore.Timestamp.fromDate(new Date(date)),
                hours: parseFloat(hours),
                description: description || '',
                taskId: taskId || null,
                status: 'submitted',
                // Add these fields if time request was used
                additionalTimeApproved: !!requestUsed,
                additionalTimeRequestId: requestUsed || null,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            
            const timesheetRef = await db.collection('timesheets').add(timesheetData);
            
            // Update project with new hours
            await db.collection('projects').doc(projectId).update({
                hoursLogged: admin.firestore.FieldValue.increment(hours),
                lastTimesheetUpdate: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            // Log activity
            await db.collection('activities').add({
                type: 'timesheet_logged',
                details: `${req.user.name} logged ${hours} hours on ${project.projectName}`,
                performedByName: req.user.name,
                performedByRole: req.user.role,
                performedByUid: req.user.uid,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                projectId: projectId,
                timesheetId: timesheetRef.id
            });
            
            // Notify Design Lead if hours are running low
            if (allocatedHours > 0) {
                const percentUsed = (newTotal / allocatedHours) * 100;
                if (percentUsed >= 80 && project.designLeadUid) {
                    await db.collection('notifications').add({
                        type: 'timesheet_warning',
                        recipientUid: project.designLeadUid,
                        recipientRole: 'design_lead',
                        message: `Project "${project.projectName}" has used ${percentUsed.toFixed(0)}% of allocated hours`,
                        projectId: projectId,
                        projectName: project.projectName,
                        hoursUsed: newTotal,
                        hoursAllocated: allocatedHours,
                        priority: percentUsed >= 90 ? 'high' : 'normal',
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        isRead: false
                    });
                }
            }
            
            return res.status(201).json({ 
                success: true, 
                message: 'Timesheet entry created',
                timesheetId: timesheetRef.id,
                totalHours: newTotal,
                allocatedHours: allocatedHours,
                remainingHours: allocatedHours - newTotal
            });
        }

        // ============================================
        // PUT - Update timesheet entry
        // ============================================
        if (req.method === 'PUT') {
            const { id } = req.query;
            const { hours, description, status } = req.body;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Timesheet ID is required' });
            }
            
            const timesheetRef = db.collection('timesheets').doc(id);
            const timesheetDoc = await timesheetRef.get();
            
            if (!timesheetDoc.exists) {
                return res.status(404).json({ success: false, error: 'Timesheet entry not found' });
            }
            
            const timesheet = timesheetDoc.data();
            
            // Only designer who created it can edit, or Design Lead/COO can approve/reject
            if (req.user.role === 'designer' && timesheet.designerUid !== req.user.uid) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'You can only edit your own timesheet entries' 
                });
            }
            
            const updates = {
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            
            // Designer can update hours and description if not yet approved
            if (req.user.role === 'designer' && timesheet.status === 'submitted') {
                if (hours !== undefined) {
                    const oldHours = timesheet.hours;
                    const hoursDiff = hours - oldHours;
                    updates.hours = parseFloat(hours);
                    
                    // Update project hours
                    await db.collection('projects').doc(timesheet.projectId).update({
                        hoursLogged: admin.firestore.FieldValue.increment(hoursDiff)
                    });
                }
                if (description !== undefined) {
                    updates.description = description;
                }
            }
            
            // Design Lead/COO can approve or reject
            if (['design_lead', 'coo', 'director'].includes(req.user.role) && status) {
                updates.status = status;
                updates.reviewedBy = req.user.name;
                updates.reviewedByUid = req.user.uid;
                updates.reviewedAt = admin.firestore.FieldValue.serverTimestamp();
            }
            
            await timesheetRef.update(updates);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Timesheet entry updated' 
            });
        }

        // ============================================
        // DELETE - Delete timesheet entry
        // ============================================
        if (req.method === 'DELETE') {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ success: false, error: 'Timesheet ID is required' });
            }
            
            const timesheetRef = db.collection('timesheets').doc(id);
            const timesheetDoc = await timesheetRef.get();
            
            if (!timesheetDoc.exists) {
                return res.status(4404).json({ success: false, error: 'Timesheet entry not found' });
            }
            
            const timesheet = timesheetDoc.data();
            
            // Only designer who created it or COO/Director can delete
            if (req.user.role === 'designer' && timesheet.designerUid !== req.user.uid) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'You can only delete your own timesheet entries' 
                });
            }
            
            if (!['designer', 'coo', 'director'].includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Permission denied' 
                });
            }
            
            // Update project hours
            await db.collection('projects').doc(timesheet.projectId).update({
                hoursLogged: admin.firestore.FieldValue.increment(-timesheet.hours)
            });
            
            await timesheetRef.delete();
            
            return res.status(200).json({ 
                success: true, 
                message: 'Timesheet entry deleted' 
            });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });
        
    } catch (error) {
        console.error('Timesheets API error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal Server Error', 
            message: error.message 
        });
    }
};

module.exports = allowCors(handler);
