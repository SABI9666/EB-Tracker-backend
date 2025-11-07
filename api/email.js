// api/email.js - Professional Email Notification API
const express = require('express');
const { Resend } = require('resend');
const admin = require('./_firebase-admin');

const emailRouter = express.Router();
const db = admin.firestore();

// ==========================================
// CONFIGURATION
// ==========================================
const FROM_EMAIL = 'EB-Tracker <sabin@edanbrook.com>'; 
const DASHBOARD_URL = 'https://edanbrook-tracker.web.app';

const EMAIL_RECIPIENT_MAP = {
  'proposal.created': ['coo', 'director', 'estimator'],
  'project.submitted': ['coo', 'director', 'estimator'],
  'project.approved_by_director': [], // Dynamic only (BDM)
  'proposal.uploaded': ['estimator'],
  'estimation.complete': ['coo'],
  'pricing.complete': ['director'], // COO completes pricing → Director approves
  'pricing.allocated': ['director'], // For backwards compatibility
  'project.won': ['coo', 'director'],
  'project.allocated': ['coo'], // COO allocates → Design Manager (+ dynamic Design Manager)
  'designer.allocated': ['coo'], // Design Manager allocates → Designer (+ dynamic Designer)
  'variation.allocated': ['bdm', 'coo', 'director'],
  'variation.approved': ['bdm', 'coo', 'director', 'design_lead'],
  'invoice.saved': ['bdm', 'coo', 'director']
};

// ==========================================
// PROFESSIONAL HTML EMAIL TEMPLATES
// ==========================================

// Base HTML wrapper for consistent styling
function getEmailWrapper(content, footerText = '') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EB-Tracker Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                EB-Tracker
              </h1>
              <p style="margin: 5px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Project Management System
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                ${footerText || 'This is an automated notification from EB-Tracker'}
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © ${new Date().getFullYear()} Edanbrook. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Reusable button component
function getButton(text, url, color = '#667eea') {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 25px 0;">
      <tr>
        <td style="border-radius: 6px; background-color: ${color};">
          <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

// Info box component
function getInfoBox(items) {
  const rows = items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
        <strong style="color: #475569; font-size: 14px;">${item.label}:</strong>
        <span style="color: #1e293b; font-size: 14px; margin-left: 8px;">${item.value}</span>
      </td>
    </tr>
  `).join('');
  
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0; background-color: #f8fafc; border-radius: 6px; padding: 15px;">
      ${rows}
    </table>
  `;
}

// Alert/Status banner
function getStatusBanner(message, type = 'info') {
  const colors = {
    success: { bg: '#dcfce7', border: '#22c55e', text: '#166534' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
  };
  
  const color = colors[type] || colors.info;
  
  return `
    <div style="background-color: ${color.bg}; border-left: 4px solid ${color.border}; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: ${color.text}; font-size: 14px; line-height: 1.5;">
        ${message}
      </p>
    </div>
  `;
}

// ==========================================
// EMAIL TEMPLATES
// ==========================================
const EMAIL_TEMPLATE_MAP = {
  'default': {
    subject: 'Notification from EB-Tracker',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px;">Notification</h2>
      <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
        ${data.message || 'You have a new notification from EB-Tracker.'}
      </p>
      ${getButton('View Dashboard', DASHBOARD_URL)}
    `)
  },

  'proposal.created': {
    subject: '📄 New Proposal Created: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        📄 New Proposal Created
      </h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        A new proposal has been submitted and requires your attention.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Created By', value: data.createdBy || 'N/A' },
        { label: 'Date', value: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }
      ])}
      ${getStatusBanner('Please review the proposal and proceed with estimation.', 'info')}
      ${getButton('View Proposal', DASHBOARD_URL)}
    `, 'Please take necessary action on this proposal.')
  },

  'project.submitted': {
    subject: '📋 Project Submitted for Review: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        📋 Project Submitted for Review
      </h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        A project has been submitted and is awaiting approval.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Submitted By', value: data.createdBy || 'N/A' }
      ])}
      ${getButton('Review Project', DASHBOARD_URL)}
    `)
  },

  'project.approved_by_director': {
    subject: '✅ Project Approved: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        ✅ Project Approved by Director
      </h2>
      ${getStatusBanner('Congratulations! Your project has been approved.', 'success')}
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Approved By', value: 'Director' }
      ])}
      <p style="margin: 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        The project is now ready to move to the next phase. Please proceed with the necessary arrangements.
      </p>
      ${getButton('View Project', DASHBOARD_URL)}
    `)
  },

  'proposal.uploaded': {
    subject: '📤 Proposal Uploaded: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        📤 Proposal Document Uploaded
      </h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        A proposal document has been uploaded and is ready for review.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Uploaded By', value: data.createdBy || 'N/A' }
      ])}
      ${getStatusBanner('Please review the proposal document at your earliest convenience.', 'info')}
      ${getButton('View Document', DASHBOARD_URL)}
    `)
  },

  'estimation.complete': {
    subject: '💰 Estimation Complete: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        💰 Project Estimation Complete
      </h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        The cost estimation has been completed for this project.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Estimated Cost', value: data.estimatedCost || 'N/A' }
      ])}
      ${getStatusBanner('Review the estimation and proceed with pricing allocation.', 'info')}
      ${getButton('Review Estimation', DASHBOARD_URL)}
    `)
  },

  'pricing.complete': {
    subject: '💵 Pricing Complete - Approval Required: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        💵 Pricing Completed by COO
      </h2>
      ${getStatusBanner('Director approval required to proceed with this project.', 'warning')}
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        The COO has completed the pricing for this project. Your approval is required before proceeding to the next stage.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Estimated Cost', value: data.estimatedCost || 'N/A' },
        { label: 'Proposed Price', value: data.finalPrice || data.proposedPrice || 'N/A' },
        { label: 'Margin', value: data.margin || 'N/A' },
        { label: 'Completed By', value: 'COO' }
      ])}
      <p style="margin: 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        <strong>Action Required:</strong> Please review the pricing details and approve or request revisions.
      </p>
      ${getButton('Review & Approve Pricing', DASHBOARD_URL, '#f59e0b')}
    `, 'Please review and approve at your earliest convenience.')
  },

  'pricing.allocated': {
    subject: '💵 Pricing Allocated: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        💵 Pricing Allocated
      </h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        Pricing has been allocated for the project.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Final Price', value: data.finalPrice || 'N/A' }
      ])}
      ${getButton('View Details', DASHBOARD_URL)}
    `)
  },

  'project.won': {
    subject: '🎉 Project Won: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #22c55e; font-size: 24px;">
        🎉 Congratulations! Project Won
      </h2>
      ${getStatusBanner('Great news! We have won this project.', 'success')}
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Contract Value', value: data.contractValue || 'N/A' }
      ])}
      <p style="margin: 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        <strong>Next Steps:</strong> COO to proceed with project allocation and team assignment.
      </p>
      ${getButton('View Project', DASHBOARD_URL, '#22c55e')}
    `, 'Time to celebrate and prepare for project kick-off!')
  },

  'project.allocated': {
    subject: '👥 New Project Allocated: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        👥 New Project Allocated by COO
      </h2>
      ${getStatusBanner('A new project has been allocated to you by COO. Designer allocation required.', 'info')}
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        The COO has allocated this project to you as Design Manager. Please review the project details and proceed with designer allocation.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Design Manager', value: data.designManager || data.designLead || 'You' },
        { label: 'Project Value', value: data.projectValue || data.finalPrice || 'N/A' },
        { label: 'Start Date', value: data.startDate || 'N/A' },
        { label: 'Allocated By', value: 'COO' }
      ])}
      <p style="margin: 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        <strong>Action Required:</strong> Review project requirements and allocate designers to the project team.
      </p>
      ${getButton('View Project & Allocate Designers', DASHBOARD_URL)}
    `, 'Please proceed with designer allocation at your earliest convenience.')
  },

  'designer.allocated': {
    subject: '🎨 New Project Assignment: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        🎨 You've Been Assigned to a Project
      </h2>
      ${getStatusBanner('You have been allocated to a new project by the Design Manager.', 'success')}
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        The Design Manager has assigned you to work on this project. Please review the project details and prepare to begin work.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Your Role', value: data.designerRole || 'Designer' },
        { label: 'Design Manager', value: data.designManager || data.designLead || 'N/A' },
        { label: 'Allocated By', value: data.allocatedBy || 'Design Manager' }
      ])}
      <p style="margin: 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        <strong>Next Steps:</strong> Review project requirements and contact your Design Manager for project briefing and task assignment.
      </p>
      ${getButton('View Project Details', DASHBOARD_URL)}
    `, 'Welcome to the project team!')
  },

  'variation.allocated': {
    subject: '🔄 Variation Request: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        🔄 New Variation Request
      </h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        A variation has been requested for the following project.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Variation Type', value: data.variationType || 'N/A' },
        { label: 'Requested By', value: data.requestedBy || 'N/A' }
      ])}
      ${getStatusBanner('Please review and approve or reject this variation request.', 'warning')}
      ${getButton('Review Variation', DASHBOARD_URL, '#f59e0b')}
    `)
  },

  'variation.approved': {
    subject: '✅ Variation Approved: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        ✅ Variation Request Approved
      </h2>
      ${getStatusBanner('The variation request has been approved.', 'success')}
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Variation Type', value: data.variationType || 'N/A' },
        { label: 'Approved By', value: data.approvedBy || 'N/A' }
      ])}
      <p style="margin: 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        Please proceed with implementing the approved changes.
      </p>
      ${getButton('View Details', DASHBOARD_URL)}
    `)
  },

  'invoice.saved': {
    subject: '🧾 Invoice Generated: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        🧾 Invoice Generated
      </h2>
      <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        A new invoice has been generated for the following project.
      </p>
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Client', value: data.clientName || 'N/A' },
        { label: 'Invoice Number', value: data.invoiceNumber || 'N/A' },
        { label: 'Amount', value: data.invoiceAmount || 'N/A' },
        { label: 'Date', value: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }
      ])}
      ${getStatusBanner('Invoice is ready for review and dispatch to client.', 'info')}
      ${getButton('View Invoice', DASHBOARD_URL)}
    `)
  },

  'time_request.approved': {
    subject: '⏰ Time Request Approved: {{projectName}}',
    html: (data) => getEmailWrapper(`
      <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 22px;">
        ⏰ Additional Time Approved
      </h2>
      ${getStatusBanner('Your request for additional time has been approved.', 'success')}
      ${getInfoBox([
        { label: 'Project Name', value: data.projectName || 'N/A' },
        { label: 'Additional Hours', value: data.additionalHours || 'N/A' },
        { label: 'Approved By', value: data.approvedBy || 'N/A' }
      ])}
      <p style="margin: 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
        You may proceed with the additional time allocated to complete your work.
      </p>
      ${getButton('View Project', DASHBOARD_URL)}
    `)
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
async function getEmailsForRoles(roles) {
  if (!roles || roles.length === 0) return [];
  try {
    const normalizedRoles = roles.map(r => r.toLowerCase().trim());
    console.log(`🔍 Looking up roles: ${normalizedRoles.join(', ')}`);
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
  return result;
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
      let bdmEmail = data.createdByEmail || data.bdmEmail;
      if (!bdmEmail) bdmEmail = await getBDMEmail(data.projectId, data.proposalId);
      
      if (bdmEmail) {
          recipients.push(bdmEmail);
          console.log(`👤 Added BDM: ${bdmEmail}`);
      }
  }
  
  // Add Design Manager (logged in user who is allocating the project)?
  if (event === 'project.allocated' && data.designManagerEmail) {
      recipients.push(data.designManagerEmail);
      console.log(`👔 Added Design Manager: ${data.designManagerEmail}`);
  }
  
  // Add Designer (when Design Manager allocates)?
  if (['designer.allocated', 'time_request.approved'].includes(event) && data.designerEmail) {
      recipients.push(data.designerEmail);
      console.log(`🎨 Added Designer: ${data.designerEmail}`);
  }

  // 3. Clean List
  recipients = [...new Set(recipients.filter(e => e && e.includes('@')))];

  if (recipients.length === 0) {
      console.warn(`⚠️ No valid recipients for '${event}'. Skipping.`);
      console.log('📨 --- END EMAIL (SKIPPED) ---\n');
      return { success: false, message: 'No recipients found' };
  }

  // 4. Build Email
  try {
    const tmpl = EMAIL_TEMPLATE_MAP[event] || EMAIL_TEMPLATE_MAP['default'];
    
    // Generate HTML (templates are now functions)
    const html = typeof tmpl.html === 'function' ? tmpl.html(data) : interpolate(tmpl.html, data);
    const subject = interpolate(tmpl.subject, data);

    console.log(`🚀 Sending from [${FROM_EMAIL}] to [${recipients.length}] recipients...`);
    console.log(`📧 Recipients: ${recipients.join(', ')}`);
    
    // 5. Send via Resend
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
    return { 
      success: true, 
      id: result.data?.id, 
      recipients: recipients.length,
      recipientList: recipients 
    };

  } catch (error) {
    console.error('❌ RESEND FAILED:', error.message);
    console.log('📨 --- END EMAIL (FAILED) ---\n');
    return { success: false, error: error.message };
  }
}

// ==========================================
// API ENDPOINT
// ==========================================
emailRouter.post('/trigger', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    if (!event) {
      return res.status(400).json({ error: 'Event type is required' });
    }
    
    const result = await sendEmailNotification(event, data || {});
    res.json(result);
  } catch (e) {
    console.error('API Error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Health check endpoint
emailRouter.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'email-notifications',
    from: FROM_EMAIL,
    hasApiKey: !!process.env.RESEND_API_KEY
  });
});

module.exports = { emailHandler: emailRouter, sendEmailNotification };
