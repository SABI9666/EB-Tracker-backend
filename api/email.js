// File: /api/email.js
// This is your new, dedicated Email API

const express = require('express');
const { Resend } = require('resend');
const admin = require('./_firebase-admin'); // Assumes your Firebase admin is here

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
const db = admin.firestore();

// --- 1. Event to Role Map (Who to email) ---
const EMAIL_RECIPIENT_MAP = {
  'project.submitted': ['bdm', 'BDM'],
  'project.approved_by_director': ['BDM','bdm'],
  'bom.file_provided_for_estimation': ['Estimator','estimator'],
  'estimation.complete': ['COO'],
  'design.variation_request': ['COO', 'Director', 'BDM'],
  'variation.approved_by_coo': ['Director','director', 'BDM','bdm', 'Design Manager'],
  'project.allotment_': ['Design Manager'] // 'designer' is handled separately
};

// --- 2. Email Template Map (What to send) ---
const EMAIL_TEMPLATE_MAP = {
  'project.submitted': {
    subject: 'New Project Submitted: {{projectName}}',
    html: '<h1>New Project Submission</h1><p>A new project has been submitted: <strong>{{projectName}}</strong>.</p><p>Please log in to the dashboard to review.</p>'
  },
  'project.approved_by_director': {
    subject: 'Project Approved: {{projectName}}',
    html: '<h1>Project Approved</h1><p>The project <strong>{{projectName}}</strong> has been approved by the Director.</p><p>Next steps can begin.</p>'
  },
  'bom.file_provided_for_estimation': {
    subject: 'BOM File Provided for {{projectName}}',
    html: '<h1>BOM Ready for Estimation</h1><p>The BOM file for <strong>{{projectName}}</strong> has been uploaded and is ready for estimation.</p>'
  },
  'estimation.complete': {
    subject: 'Estimation Complete: {{projectName}}',
    html: '<h1>Estimation Complete</h1><p>Estimation for project <strong>{{projectName}}</strong> is complete.</p><p>Please review and proceed.</p>'
  },
  'design.variation_request': {
    subject: 'New Variation Request for {{projectName}}',
    html: '<h1>New Variation Request</h1><p>A new design variation has been requested for <strong>{{projectName}}</strong>.</p><p>Details: {{variationDetails}}</p>'
  },
  'variation.approved_by_coo': {
    subject: 'Variation Approved: {{projectName}}',
    html: '<h1>Variation Approved</h1><p>The variation for <strong>{{projectName}}</strong> has been approved by the COO.</p>'
  },
  'project.allotment_': {
    subject: 'New Project Allotted: {{projectName}}',
    html: '<h1>New Project Allotment</h1><p>You have been allotted a new project: <strong>{{projectName}}</strong>.</p><p>Please check the dashboard for files and details.</p>'
  },
  'default': { // Fallback template
    subject: 'Notification from EB-Tracker',
    html: '<h1>Notification</h1><p>An event occurred: <strong>{{event}}</strong></p>'
  }
};

/**
 * Fetches email addresses from Firestore based on user roles.
 */
async function getEmailsForRoles(roles) {
  if (!roles || roles.length === 0) {
    return [];
  }
  try {
    const q = db.collection('users').where('role', 'in', roles);
    const snapshot = await q.get();
    
    if (snapshot.empty) {
      console.log('No users found for roles:', roles);
      return [];
    }
    const emails = snapshot.docs.map(doc => doc.data().email).filter(Boolean);
    return [...new Set(emails)]; // Return unique emails
  } catch (error) {
    console.error('Error fetching emails for roles:', error);
    return [];
  }
}

/**
 * A simple template interpolator
 * Replaces {{key}} with data[key]
 */
function interpolate(template, data) {
    if (!data) return template;
    // Add event to data so {{event}} always works
    const enhancedData = { ...data, event: data.event || 'Unknown Event' };

    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
        return enhancedData[key.trim()] || match; // Keep original {{key}} if not found
    });
}

// --- 3. THE API ENDPOINT ---
// This creates the POST /api/email/trigger endpoint
router.post('/trigger', async (req, res) => {
  try {
    const { event, data } = req.body; // data = { projectName: 'X', designerEmail: '...' }

    if (!event) {
      return res.status(400).json({ error: 'Event name is required.' });
    }

    // 1. Get roles and template
    const rolesToNotify = EMAIL_RECIPIENT_MAP[event];
    const template = EMAIL_TEMPLATE_MAP[event] || EMAIL_TEMPLATE_MAP['default']; // Use default if event specific not found

    if (!rolesToNotify) {
      console.warn(`No email recipients mapped for event: ${event}`);
      // We can still proceed if it's a special case like allotment
    }

    // 2. Get email addresses from Firestore
    let recipientEmails = rolesToNotify ? await getEmailsForRoles(rolesToNotify) : [];

    // 3. --- SPECIAL CASE: Project Allotment ---
    if (event === 'project.allotment_' && data && data.designerEmail) {
      recipientEmails.push(data.designerEmail);
    }
    
    // 4. Check for recipients
    const uniqueEmails = [...new Set(recipientEmails)];
    if (uniqueEmails.length === 0) {
      return res.status(200).json({ message: 'Event valid, but no email recipients.' });
    }

    // 5. --- Send the Email with Resend ---
    const subject = interpolate(template.subject, { ...data, event });
    const htmlContent = interpolate(template.html, { ...data, event });
    const fromEmail = process.env.YOUR_VERIFIED_DOMAIN_EMAIL || 'notifications@yourcompany.com';

    const { data: sendData, error: sendError } = await resend.emails.send({
      from: `EB-Tracker <${fromEmail}>`,
      to: uniqueEmails,
      subject: subject,
      html: htmlContent,
    });

    if (sendError) {
      console.error('Resend Error:', sendError);
      return res.status(500).json({ error: 'Failed to send email.' });
    }

    res.status(200).json({ message: 'Email(s) sent successfully.', sendId: sendData.id });

  } catch (error) {
    console.error('Server Error in /email/trigger:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// A test GET route for this API
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Email API is active. Use POST /api/email/trigger to send.' });
});

module.exports = router;
