// api/email.js - Email notification API
const express = require('express');
const { Resend } = require('resend');
const admin = require('./_firebase-admin');

const emailRouter = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
const db = admin.firestore();

// ==========================================
// 1. CONFIGURATION: WHO GETS EMAILED
// ==========================================
// This map defines the *fixed roles* that always get the email for a specific event.
// Dynamic recipients (like "that specific BDM" or "that specific Designer") are handled in Step 3.
const EMAIL_RECIPIENT_MAP = {
  // BDM uploads proposal -> Notify COO, Director (+ BDM confirmation in Step 3)
  'proposal.created': ['coo', 'director', 'estimator'],
  
  // Estimator finishes -> Notify COO
  'estimation.complete': ['coo'],

  // COO finishes pricing -> Notify Director
  'pricing.complete': ['director'],

  // BDM marks Won/Lost -> Notify COO, Director
  'project.won': ['coo', 'director'],
  'project.lost': ['coo', 'director'],

  // COO allocates to Design -> Notify Design Manager
  'project.allocated': ['design_lead'], 

  // Design Manager requests variation -> Notify COO
  'variation.request': ['coo'],

  // COO approves variation -> Notify Design Mgr, Director (+ BDM in Step 3)
  'variation.approved': ['design_lead', 'director'],
  'variation.rejected': ['design_lead'],

  // Designer requests hours -> Notify COO, Director
  'time_request.created': ['coo', 'director'],

  // COO approves hours -> Notify Director (+ Designer in Step 3)
  'time_request.approved': ['director'],

  // Accounts saves invoice -> Notify COO, Director (+ BDM in Step 3)
  'invoice.saved': ['coo', 'director']
};

// ==========================================
// 2. EMAIL TEMPLATES
// ==========================================
const EMAIL_TEMPLATE_MAP = {
  'proposal.created': {
    subject: '📄 New Proposal Uploaded: {{projectName}}',
    html: `
      <h2>New Proposal Uploaded</h2>
      <p>A new proposal has been uploaded and is ready for review/estimation.</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Client:</strong> {{clientName}}</li>
        <li><strong>Uploaded By:</strong> {{createdBy}}</li>
      </ul>
      <a href="{{dashboardUrl}}" style="background:#667eea;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">View Proposal</a>
    `
  },
  'pricing.complete': {
    subject: '💰 Pricing Completed: {{projectName}}',
    html: `
      <h2>Pricing Ready for Approval</h2>
      <p>The COO has completed pricing for the following project:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Quote Value:</strong> {{quoteValue}}</li>
      </ul>
      <p>Please review and approve.</p>
      <a href="{{dashboardUrl}}" style="background:#667eea;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Review Pricing</a>
    `
  },
  'project.won': {
    subject: '🎉 Project WON: {{projectName}}',
    html: `
      <h2 style="color: green;">Project Won!</h2>
      <p>Excellent news! The following proposal has been marked as WON:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Client:</strong> {{clientName}}</li>
      </ul>
      <p><strong>COO:</strong> Please proceed with project allocation.</p>
    `
  },
  'project.lost': {
    subject: '❌ Project Lost: {{projectName}}',
    html: `
      <h2 style="color: #d32f2f;">Project Lost</h2>
      <p>The following proposal has been marked as lost:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Reason:</strong> {{reason}}</li>
      </ul>
    `
  },
  'variation.request': {
    subject: '🔄 Variation Approval Needed: {{variationCode}}',
    html: `
      <h2>Variation Request</h2>
      <p>A new variation requires COO approval:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Variation:</strong> {{variationCode}}</li>
        <li><strong>Requested Hours:</strong> {{hours}}h</li>
      </ul>
      <a href="{{dashboardUrl}}" style="background:#f59e0b;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Review Variation</a>
    `
  },
  'variation.approved': {
    subject: '✅ Variation Approved: {{variationCode}}',
    html: `
      <h2>Variation Approved</h2>
      <p>The following variation has been approved by the COO:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Variation:</strong> {{variationCode}}</li>
        <li><strong>Approved Hours:</strong> {{hours}}h</li>
      </ul>
      <p>Design team may proceed with these changes.</p>
    `
  },
  'time_request.created': {
    subject: '⏱️ Additional Hours Requested: {{projectName}}',
    html: `
      <h2>Time Request Pending</h2>
      <p>A designer has requested additional hours:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Designer:</strong> {{designerName}}</li>
        <li><strong>Requested:</strong> {{hours}}h</li>
        <li><strong>Reason:</strong> {{reason}}</li>
      </ul>
      <a href="{{dashboardUrl}}" style="background:#667eea;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Review Request</a>
    `
  },
  'time_request.approved': {
    subject: '✅ Additional Hours Approved: {{projectName}}',
    html: `
      <h2>Hours Approved</h2>
      <p>Your request for additional time has been approved:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Approved Hours:</strong> {{hours}}h</li>
      </ul>
      <p>Please continue your good work.</p>
    `
  },
  'invoice.saved': {
    subject: '💵 Invoice Created: {{invoiceNumber}}',
    html: `
      <h2>New Invoice Saved</h2>
      <p>Accounts team has created a new invoice:</p>
      <ul>
        <li><strong>Project:</strong> {{projectName}}</li>
        <li><strong>Invoice #:</strong> {{invoiceNumber}}</li>
        <li><strong>Amount:</strong> {{amount}}</li>
      </ul>
    `
  },
   'default': {
    subject: 'Notification from EB-Tracker',
    html: `<p>{{message}}</p>`
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Fetch emails for fixed roles (e.g., 'coo', 'director')
async function getEmailsForRoles(roles) {
  if (!roles || roles.length === 0) return [];
  try {
    // Normalize roles to match your Firestore 'role' field exactly
    const normalizedRoles = roles.map(r => r.toLowerCase().trim());
    const q = db.collection('users').where('role', 'in', normalizedRoles);
    const snapshot = await q.get();
    return snapshot.docs.map(doc => doc.data().email).filter(Boolean);
  } catch (error) {
    console.error('Error fetching role emails:', error);
    return [];
  }
}

// Fetch the BDM's email for a specific project/proposal
async function getBDMEmail(projectId, proposalId) {
  try {
    let uid = null;
    // Try proposal first as it usually has the creator
    if (proposalId) {
       const doc = await db.collection('proposals').doc(proposalId).get();
       if (doc.exists) uid = doc.data().createdByUid;
    }
    // If not, try project
    if (!uid && projectId) {
       const doc = await db.collection('projects').doc(projectId).get();
       if (doc.exists) uid = doc.data().bdmUid || doc.data().createdBy;
    }
    // If we found a UID, get their email
    if (uid) {
       const userDoc = await db.collection('users').doc(uid).get();
       if (userDoc.exists) return userDoc.data().email;
    }
  } catch (e) {
    console.error("Error fetching BDM email:", e);
  }
  return null;
}

// Basic template engine
function interpolate(template, data) {
  let result = template || '';
  for (const key in data) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || '');
  }
  // Default dashboard URL if missing
  result = result.replace(/{{dashboardUrl}}/g, 'https://edanbrook-tracker.web.app'); 
  return result;
}

// ==========================================
// MAIN SEND FUNCTION (Exported)
// ==========================================
async function sendEmailNotification(event, data) {
  if (!event) throw new Error('Event required');
  console.log(`📧 Processing Email Event: [${event}]`);

  // 1. Get Fixed Recipients based on Role Map
  const roles = EMAIL_RECIPIENT_MAP[event] || [];
  let recipients = await getEmailsForRoles(roles);

  // 2. Add Dynamic Recipients (The "THAT PROJECT BDM" logic)
  
  // -> Add BDM for specific events
  if (['proposal.created', 'variation.approved', 'invoice.saved'].includes(event)) {
      // Try to get BDM email from data payload first, then fallback to DB lookup
      let bdmEmail = data.bdmEmail;
      if (!bdmEmail && (data.projectId || data.proposalId)) {
          bdmEmail = await getBDMEmail(data.projectId, data.proposalId);
      }
      if (bdmEmail) {
          recipients.push(bdmEmail);
          console.log(`   -> Added BDM: ${bdmEmail}`);
      }
  }

  // -> Add specific Designer for time approval
  if (event === 'time_request.approved' && data.designerEmail) {
      recipients.push(data.designerEmail);
       console.log(`   -> Added Designer: ${data.designerEmail}`);
  }

  // 3. Clean recipient list
  recipients = [...new Set(recipients.filter(e => e && e.includes('@')))];
  
  if (recipients.length === 0) {
      console.log('   -> No recipients found. Skipping email.');
      return { success: false, message: 'No recipients' };
  }

  // 4. Prepare Content
  const tmpl = EMAIL_TEMPLATE_MAP[event] || EMAIL_TEMPLATE_MAP['default'];
  const html = interpolate(tmpl.html, data);
  const subject = interpolate(tmpl.subject, data);

  // 5. Send via Resend
  try {
    const fromEmail = 'notifications@edanbrook.com'; // MUST be verified in Resend
    await resend.emails.send({
      from: `EB-Tracker <${fromEmail}>`,
      to: recipients,
      subject: subject,
      html: html
    });
    console.log(`   -> ✅ Sent to ${recipients.length} recipients.`);
    return { success: true, recipientCount: recipients.length };
  } catch (error) {
    console.error('   -> ❌ Resend API Error:', error.message);
    // Don't crash the main app if email fails
    return { success: false, error: error.message };
  }
}

// API Endpoint wrapper
emailRouter.post('/trigger', async (req, res) => {
  try {
    const result = await sendEmailNotification(req.body.event, req.body.data || {});
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = { emailHandler: emailRouter, sendEmailNotification };
