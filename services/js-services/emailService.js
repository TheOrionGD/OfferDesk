const nodemailer = require('nodemailer');
const axios = require('axios');
const templates = require('./emailTemplates');

/**
 * OfferDesk Brevo SMTP & Email Service Handler
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'b463ca001@smtp-brevo.com';
  const pass = process.env.SMTP_PASS || '';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Fallback sending via Brevo v3 HTTP API
 */
async function sendViaBrevoAPI({ to, subject, html, text }) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'godfrey.cs23@krct.ac.in';
  const fromName = process.env.SMTP_FROM_NAME || 'OfferDesk Security';

  if (!brevoApiKey) {
    throw new Error('BREVO_API_KEY is missing');
  }

  const payload = {
    sender: { name: fromName, email: fromEmail },
    to: Array.isArray(to) ? to.map(e => ({ email: e })) : [{ email: to }],
    subject: subject,
    htmlContent: html,
    textContent: text || html.replace(/<[^>]+>/g, ''),
  };

  const response = await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
    headers: {
      'accept': 'application/json',
      'api-key': brevoApiKey,
      'content-type': 'application/json',
    },
    timeout: 10000,
  });

  return response.data;
}

/**
 * Generic Mail Sending Function with Automatic Retry and Fallback
 */
async function sendMail({ to, subject, html, text }) {
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'godfrey.cs23@krct.ac.in';
  const fromName = process.env.SMTP_FROM_NAME || 'OfferDesk Security';
  const fromAddress = `"${fromName}" <${fromEmail}>`;

  // First try SMTP relay
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ''),
    });
    console.log(`✅ Email sent via Brevo SMTP to ${to} (MessageId: ${info.messageId})`);
    return { success: true, method: 'smtp', messageId: info.messageId };
  } catch (smtpErr) {
    console.warn(`⚠️ SMTP send failed (${smtpErr.message}). Attempting Brevo HTTP API fallback...`);
    
    // Fallback to Brevo REST API
    try {
      const apiResult = await sendViaBrevoAPI({ to, subject, html, text });
      console.log(`✅ Email sent via Brevo HTTP API to ${to}`, apiResult);
      return { success: true, method: 'api', result: apiResult };
    } catch (apiErr) {
      console.error(`❌ All Email Sending Mechanisms Failed for ${to}:`, apiErr.response ? apiErr.response.data : apiErr.message);
      throw new Error(`Email delivery failed: ${apiErr.message}`);
    }
  }
}

/**
 * High-Level Feature Email Methods
 */
async function sendOTPVerificationEmail(recipientEmail, data) {
  const html = templates.getOTPVerificationTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `OfferDesk Security: Verification OTP (${data.otpCode})`,
    html,
  });
}

async function sendPasswordResetEmail(recipientEmail, data) {
  const html = templates.getPasswordResetTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `OfferDesk Security: Password Reset Request`,
    html,
  });
}

async function sendDriveAnnouncementEmail(recipientEmail, data) {
  const html = templates.getDriveAnnouncementTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `New Placement Drive: ${data.companyName} (${data.role || 'Recruitment'})`,
    html,
  });
}

async function sendApplicationStatusEmail(recipientEmail, data) {
  const html = templates.getApplicationStatusTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `Application Status: ${data.companyName} - ${data.status}`,
    html,
  });
}

async function sendInterviewInvitationEmail(recipientEmail, data) {
  const html = templates.getInterviewInvitationTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `Interview Call: ${data.companyName} - ${data.roundName}`,
    html,
  });
}

async function sendOfferReleaseEmail(recipientEmail, data) {
  const html = templates.getOfferReleaseTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `🎉 Congratulations! Offer Released by ${data.companyName} (${data.CTC})`,
    html,
  });
}

async function sendMentorshipBookingEmail(recipientEmail, data) {
  const html = templates.getMentorshipBookingTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `Mentorship Session Confirmed: ${data.topic}`,
    html,
  });
}

async function sendSecurityAlertEmail(recipientEmail, data) {
  const html = templates.getSecurityAlertTemplate(data);
  return sendMail({
    to: recipientEmail,
    subject: `OfferDesk Security Alert: New Device Access`,
    html,
  });
}

async function sendTenantCreationNotificationEmail(data) {
  const targetEmail = 'hello.theoriongd@gmail.com';
  const html = templates.getTenantCreationNotificationTemplate(data);
  return sendMail({
    to: targetEmail,
    subject: `🏛️ New Institution Tenant Onboarding Request: ${data.name || 'University'} (${data.code || 'INST'})`,
    html,
  });
}

module.exports = {
  sendMail,
  templates,
  sendOTPVerificationEmail,
  sendPasswordResetEmail,
  sendDriveAnnouncementEmail,
  sendApplicationStatusEmail,
  sendInterviewInvitationEmail,
  sendOfferReleaseEmail,
  sendMentorshipBookingEmail,
  sendSecurityAlertEmail,
  sendTenantCreationNotificationEmail,
};

