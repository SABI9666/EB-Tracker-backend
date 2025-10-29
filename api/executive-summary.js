// This is a NEW file to power the Executive Timesheet Monitoring dashboard.

const admin = require('../_firebase-admin'); // Adjust path if needed
const { verifyToken } = require('../middleware/auth'); // Adjust path if needed
const util = require('util');

const db = admin.firestore();

// Standard CORS helper function
const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

const handler = async (req, res) => {
    try {
        // 1. Authenticate the user
        await util.promisify(verifyToken)(req, res);

        // 2. Authorize: Only allow executive roles to see this data
        const allowedRoles = ['coo', 'director', 'design_lead'];
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                error: 'Permission Denied. Executive access required.' 
            });
        }

        // 3. Handle GET request
        if (req.method === 'GET') {
            const { fromDate, toDate } = req.query;

            // 4. Validate Date Inputs
            if (!fromDate || !toDate) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Both fromDate and toDate are required.' 
                });
            }

            // Convert date strings to Firestore Timestamps for querying
            const fromTimestamp = admin.firestore.Timestamp.fromDate(new Date(fromDate));
            // Add 1 day to 'toDate' to include the entire day
            const toDateObj = new Date(toDate);
            toDateObj.setDate(toDateObj.getDate() + 1);
            const toTimestamp = admin.firestore.Timestamp.fromDate(toDateObj);

            // 5. Query Firestore
            // We query projects that have had timesheet updates within the date range.
            // This is efficient because 'timesheets.js' updates 'lastTimesheetUpdate' on the project.
            const projectsRef = db.collection('projects');
            const snapshot = await projectsRef
                .where('lastTimesheetUpdate', '>=', fromTimestamp)
                .where('lastTimesheetUpdate', '<=', toTimestamp)
                .get();

            if (snapshot.empty) {
                // Return empty data if no projects were active in this period
                return res.status(200).json({
                    success: true,
                    data: {
                        totalProjects: 0,
                        onTrackProjects: 0,
                        atRiskProjects: 0,
                        exceededProjects: 0,
                        totalHoursAllocated: 0,
                        totalHoursLogged: 0,
                    }
                });
            }

            // 6. Aggregate the Data
            let summary = {
                totalProjects: 0,
                onTrackProjects: 0,
                atRiskProjects: 0,
                exceededProjects: 0,
                totalHoursAllocated: 0,
                totalHoursLogged: 0,
            };

            snapshot.docs.forEach(doc => {
                const project = doc.data();
                
                // Get hours from the project document. 
                // These are updated by your 'timesheets.js' API.
                const allocated = project.allocatedHours || 0;
                const logged = project.hoursLogged || 0;

                summary.totalProjects++;
                summary.totalHoursAllocated += allocated;
                summary.totalHoursLogged += logged;

                // Categorize projects based on budget usage (matches your screenshot)
                if (allocated > 0) {
                    const budgetUsed = (logged / allocated) * 100;
                    
                    if (budgetUsed <= 70) {
                        summary.onTrackProjects++;
                    } else if (budgetUsed > 70 && budgetUsed <= 100) {
                        summary.atRiskProjects++;
                    } else if (budgetUsed > 100) {
                        summary.exceededProjects++;
                    }
                } else {
                    // If 0 hours allocated, count as 'On-Track'
                    summary.onTrackProjects++;
                }
            });

            // 7. Send the successful response
            return res.status(200).json({ success: true, data: summary });
        }

        return res.status(405).json({ success: false, error: 'Method not allowed' });

    } catch (error) {
        console.error('Executive Summary API error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message
        });
    }
};

module.exports = allowCors(handler);
