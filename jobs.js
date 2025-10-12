// cron-jobs.js - Scheduled tasks for the system
const cron = require('node-cron');
const { checkOverduePayments } = require('./api/payments');
const admin = require('./api/_firebase-admin');

const db = admin.firestore();

// Check for overdue payments daily at 9 AM
const overduePaymentsJob = cron.schedule('0 9 * * *', async () => {
    console.log('Running overdue payments check...');
    try {
        const overdueCount = await checkOverduePayments();
        console.log(`Found ${overdueCount} overdue payments`);
        
        // Log the check
        await db.collection('activities').add({
            type: 'system_check',
            details: `System checked for overdue payments. Found: ${overdueCount}`,
            performedByName: 'System',
            performedByRole: 'automated',
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Overdue payments check failed:', error);
    }
}, {
    scheduled: false,
    timezone: "Asia/Kolkata"
});

// Check for pending tasks reminders daily at 8 AM
const taskRemindersJob = cron.schedule('0 8 * * *', async () => {
    console.log('Running task reminders check...');
    try {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Find tasks due tomorrow
        const snapshot = await db.collection('tasks')
            .where('status', 'in', ['not_started', 'in_progress'])
            .get();
        
        let reminderCount = 0;
        for (const doc of snapshot.docs) {
            const task = doc.data();
            if (!task.targetDate) continue;
            
            const targetDate = task.targetDate.toDate ? 
                task.targetDate.toDate() : 
                new Date(task.targetDate);
            
            const diffTime = targetDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Send reminder if due in 1 day
            if (diffDays === 1) {
                await db.collection('notifications').add({
                    type: 'task_reminder',
                    recipientUid: task.designerUid,
                    message: `Reminder: Task "${task.taskDescription}" is due tomorrow`,
                    projectId: task.projectId,
                    taskId: doc.id,
                    priority: 'high',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    isRead: false
                });
                reminderCount++;
            }
        }
        
        console.log(`Sent ${reminderCount} task reminders`);
    } catch (error) {
        console.error('Task reminders check failed:', error);
    }
}, {
    scheduled: false,
    timezone: "Asia/Kolkata"
});

// Weekly project status report - Every Monday at 9 AM
const weeklyReportJob = cron.schedule('0 9 * * 1', async () => {
    console.log('Generating weekly project status report...');
    try {
        // Get all active projects
        const projectsSnapshot = await db.collection('projects')
            .where('status', 'in', ['active', 'pending_setup'])
            .get();
        
        const reportData = {
            totalActiveProjects: projectsSnapshot.size,
            projectsByStatus: {},
            overdueProjects: [],
            completedThisWeek: 0
        };
        
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        for (const doc of projectsSnapshot.docs) {
            const project = doc.data();
            
            // Count by status
            reportData.projectsByStatus[project.status] = 
                (reportData.projectsByStatus[project.status] || 0) + 1;
            
            // Check if overdue
            if (project.targetCompletionDate) {
                const targetDate = project.targetCompletionDate.toDate ? 
                    project.targetCompletionDate.toDate() : 
                    new Date(project.targetCompletionDate);
                
                if (targetDate < new Date() && project.status !== 'completed') {
                    reportData.overdueProjects.push({
                        projectCode: project.projectCode,
                        projectName: project.projectName,
                        daysOverdue: Math.floor((new Date() - targetDate) / (1000 * 60 * 60 * 24))
                    });
                }
            }
        }
        
        // Send report to management
        const managementRoles = ['coo', 'director'];
        for (const role of managementRoles) {
            await db.collection('notifications').add({
                type: 'weekly_report',
                recipientRole: role,
                message: `Weekly Report: ${reportData.totalActiveProjects} active projects, ${reportData.overdueProjects.length} overdue`,
                reportData: reportData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                isRead: false
            });
        }
        
        console.log('Weekly report generated and sent');
    } catch (error) {
        console.error('Weekly report generation failed:', error);
    }
}, {
    scheduled: false,
    timezone: "Asia/Kolkata"
});

// Start all cron jobs
function startCronJobs() {
    overduePaymentsJob.start();
    taskRemindersJob.start();
    weeklyReportJob.start();
    console.log('All cron jobs started');
}

// Stop all cron jobs
function stopCronJobs() {
    overduePaymentsJob.stop();
    taskRemindersJob.stop();
    weeklyReportJob.stop();
    console.log('All cron jobs stopped');
}

module.exports = {
    startCronJobs,
    stopCronJobs,
    overduePaymentsJob,
    taskRemindersJob,
    weeklyReportJob
}