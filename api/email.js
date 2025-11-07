// api/email.js - Email notification API (FIXED SENDER)
const express = require('express');
const { Resend } = require('resend');
const admin = require('./_firebase-admin');

const emailRouter = express.Router();
const db = admin.firestore();

// ==========================================
// CONFIGURATION
// ==========================================
// ✅ FIXED: Hardcoded to your verified domain to prevent errors
const FROM_EMAIL = 'EB-Tracker <sabin@edanbrook.com>'; 

const EMAIL_RECIPIENT_MAP = {
  'proposal.created': ['coo', 'director', 'estimator'],
  'project.submitted': ['coo', 'director', 'estimator'],
  'project.approved_by_director': [], // Dynamic only (BDM)
  'proposal.uploaded': ['estimator'],
  'estimation.complete': ['coo'],
  'pricing.allocated': ['director'],
  'project.won': ['coo', 'director'],
  'project.allocated': ['design_lead'], 
  'designer.allocated': [], // Dynamic only (Designer)
  'variation.allocated': ['bdm', 'coo', 'director'],
  'variation.approved': ['bdm', 'coo', 'director', 'design_lead'],
  'invoice.saved': ['bdm', 'coo', 'director']
};

// ... (Your existing templates are good, keeping them standard here for brevity, 
// but you can paste your full EMAIL_TEMPLATE_MAP back if you customized it further)
const EMAIL_TEMPLATE_MAP = {
  'default': {
    subject: 'Notification from EB-Tracker',
    html: `<p>{{message}}</p>`
  },
  'proposal.created': {
    subject: '📄 New Proposal: {{projectName}}',
    html: `<h2>New Proposal Uploaded</h2><p><strong>Project:</strong> {{projectName}}<br><strong>Client:</strong> {{clientName}}<br><strong>By:</strong> {{createdBy}}</p><a href="{{dashboardUrl}}" style="padding:10px;background:#667eea;color:white;border-radius:5px;text-decoration:none;">View Dashboard</a>`
  },
  'project.approved_by_director': {
    subject: '✅ Project Approved: {{projectName}}',
    html: `<h2>Project Approved</h2><p><strong>Project:</strong> {{projectName}} has been approved by the Director.</p>`
  },
  'project.won': {
    subject: '🎉 Project WON: {{projectName}}',
    html: `<h2 style="color:green">Project Won!</h2><p><strong>Client:</strong> {{clientName}}</p><p>COO: Please proceed with allocation.</p>`
  },
  // ... Add other specific templates here as needed
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
async function getEmailsForRoles(roles) {
  if (!roles || roles.length === 0) return [];
  try {
    const normalizedRoles = roles.map(r => r.toLowerCase().trim());
    // console.log(`🔍 Looking up roles: ${normalizedRoles.join(', ')}`);
    const snapshot = await db.collection('users').where('role', 'in', normalizedRoles).get();
    return snapshot.docs.map(doc => doc.data().email).filter(e => e && e.includes('@'));
  } catch (error) {
    console.error('❌ Error fetching role emails:', error.message);
    return [];
  }
}

async function getBDMEmail(projectId, proposalId) {
  try {
    let uid = null;
    if (proposalId) {
       const doc = await db.collection('proposals').doc(proposalId).get();
       if (doc.exists) uid = doc.data().createdByUid;
    }
    if (!uid && projectId) {
       const doc = await db.collection('projects').doc(projectId).get();
       if (doc.exists) uid = doc.data().bdmUid || doc.data().createdBy;
    }
    if (uid) {
       const userDoc = await db.collection('users').doc(uid).get();
       if (userDoc.exists) return userDoc.data().email;
    }
  } catch (e) {
    console.error("⚠️ Error fetching BDM email:", e.message);
  }
  return null;
}

function interpolate(template, data) {
  let result = template || '';
  for (const key in data) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), data[key] || 'N/A');
  }
  return result.replace(/{{dashboardUrl}}/g, 'https://edanbrook-tracker.web.app'); 
}

// ==========================================
// MAIN SEND FUNCTION (EXPORTED)
// ==========================================
async function sendEmailNotification(event, data) {
  console.log(`\n📨 --- START EMAIL: [${event}] ---`);

  if (!process.env.RESEND_API_KEY) {
      console.error('⛔ CRITICAL: RESEND_API_KEY is missing!');
      return { success: false, error: 'Missing API Key' };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1. Get Recipients
  const roles = EMAIL_RECIPIENT_MAP[event] || [];
  let recipients = await getEmailsForRoles(roles);

  // 2. Dynamic Additions
  // Add BDM?
  if (['proposal.created', 'project.submitted', 'project.approved_by_director', 'variation.approved', 'invoice.saved'].includes(event)) {
      // Try data first, then DB lookup
      let bdmEmail = data.createdByEmail || data.bdmEmail;
      if (!bdmEmail) bdmEmail = await getBDMEmail(data.projectId, data.proposalId);
      
      if (bdmEmail) {
          recipients.push(bdmEmail);
          console.log(`👤 Added BDM: ${bdmEmail}`);
      }
  }
  // Add Designer?
  if (['designer.allocated', 'time_request.approved'].includes(event) && data.designerEmail) {
      recipients.push(data.designerEmail);
  }

  // 3. Clean List
  recipients = [...new Set(recipients.filter(e => e && e.includes('@')))];

  if (recipients.length === 0) {
      console.warn(`⚠️ No valid recipients for '${event}'. Skipping.`);
      console.log('📨 --- END EMAIL (SKIPPED) ---\n');
      return { success: false, message: 'No recipients found' };
  }

  // 4. Send
  try {
    const tmpl = EMAIL_TEMPLATE_MAP[event] || EMAIL_TEMPLATE_MAP['default'];
    const html = interpolate(tmpl.html, data);
    const subject = interpolate(tmpl.subject, data);

    console.log(`🚀 Sending from [${FROM_EMAIL}] to [${recipients.length}] recipients...`);
    
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipients,
      subject: subject,
      html: html
    });

    if (result.error) {
        throw new Error(result.error.message);
    }

    console.log(`✅ SENT! ID: ${result.data?.id}`);
    console.log('📨 --- END EMAIL (SUCCESS) ---\n');
    return { success: true, id: result.data?.id, recipients: recipients.length };

  } catch (error) {
    console.error('❌ RESEND FAILED:', error.message);
    console.log('📨 --- END EMAIL (FAILED) ---\n');
    return { success: false, error: error.message };
  }
}

// API Trigger
emailRouter.post('/trigger', async (req, res) => {
  try {
    const result = await sendEmailNotification(req.body.event, req.body.data || {});
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = { emailHandler: emailRouter, sendEmailNotification };
