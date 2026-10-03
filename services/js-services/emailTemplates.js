/**
 * OfferDesk System HTML Email Templates
 * Styled according to OfferDesk UI Design System:
 * - Primary Emerald Accent (#00c853, #2e7d32, #1b5e20)
 * - Soft Slate Background (#f4f7fa)
 * - Dark Slate Typography (#1e293b)
 * - Pill Badges & High Contrast Action Buttons
 */

const getBaseWrapper = (title, contentHTML) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f7fa;
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f7fa;
      padding-bottom: 40px;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      color: #1e293b;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .top-bar {
      height: 6px;
      background: linear-gradient(90deg, #00c853 0%, #2e7d32 100%);
    }
    .header {
      padding: 28px 32px 20px 32px;
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
      text-align: left;
    }
    .brand-logo {
      display: inline-block;
      vertical-align: middle;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #1b5e20;
      letter-spacing: -0.5px;
      margin: 0;
      display: inline-block;
      vertical-align: middle;
    }
    .brand-badge {
      display: inline-block;
      background: #e8f5e9;
      color: #2e7d32;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      margin-left: 8px;
      vertical-align: middle;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px;
      background-color: #ffffff;
    }
    .footer {
      padding: 24px 32px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #00c853;
      text-decoration: none;
      font-weight: 600;
    }
    .btn-primary {
      background: linear-gradient(135deg, #00c853 0%, #2e7d32 100%);
      color: #ffffff !important;
      padding: 14px 32px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(0, 200, 83, 0.35);
      margin-top: 20px;
      margin-bottom: 20px;
      text-align: center;
    }
    .code-box {
      background: #f0fdf4;
      border: 2px dashed #00c853;
      border-radius: 12px;
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 8px;
      color: #1b5e20;
      text-align: center;
      padding: 20px;
      margin: 24px 0;
    }
    .info-card {
      background: #f8fafc;
      border-left: 4px solid #00c853;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-info { background: #e0f2fe; color: #075985; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <table role="presentation" width="100%">
      <tr>
        <td align="center" style="padding-top: 30px;">
          <table class="main" role="presentation">
            <tr>
              <td class="top-bar"></td>
            </tr>
            <tr>
              <td class="header">
                <table width="100%" role="presentation">
                  <tr>
                    <td>
                      <span class="brand-title">OfferDesk</span>
                      <span class="brand-badge">Placement & Security</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="content">
                ${contentHTML}
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p style="margin: 0 0 8px 0;"><strong>OfferDesk Campus Placement & Security Engine</strong></p>
                <p style="margin: 0 0 12px 0;">Automated Campus Recruitment, Verified Offers & Student Security</p>
                <p style="margin: 0;">This email was sent from an automated system. Please do not reply directly to this message.</p>
                <p style="margin-top: 12px; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} OfferDesk Ecosystem. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

/**
 * 1. OTP Verification Email Template
 */
function getOTPVerificationTemplate({ recipientName = 'User', otpCode = '123456', expiresMinutes = 10, tenantName = 'OfferDesk Platform' }) {
  const content = `
    <h2 style="margin-top: 0; color: #1e293b; font-size: 20px; font-weight: 800;">Verify Your Identity</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Use the One-Time Password (OTP) below to complete your authentication on <strong>${tenantName}</strong>.
    </p>

    <div class="code-box">
      ${otpCode}
    </div>

    <div class="info-card">
      <p style="margin: 0; font-size: 13px; color: #334155;">
        <strong>⏳ Security Notice:</strong> This OTP code is valid for <strong>${expiresMinutes} minutes</strong>. Never share this code with anyone, including college placement administrators.
      </p>
    </div>

    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">If you did not request this verification code, please ignore this email or notify security immediately.</p>
  `;
  return getBaseWrapper('OfferDesk Security - Verification OTP', content);
}

/**
 * 2. Password Reset Email Template
 */
function getPasswordResetTemplate({ recipientName = 'User', resetLink = '#', resetCode = '', expiresMinutes = 15 }) {
  const content = `
    <h2 style="margin-top: 0; color: #1e293b; font-size: 20px; font-weight: 800;">Password Reset Request</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      We received a request to reset the password for your OfferDesk account. Click the button below to set a new password:
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${resetLink}" class="btn-primary" target="_blank">Reset My Password</a>
    </div>

    ${resetCode ? `
      <p style="color: #475569; font-size: 13px; text-align: center;">Alternatively, enter this reset authorization code in your app:</p>
      <div class="code-box" style="font-size: 24px; letter-spacing: 4px;">${resetCode}</div>
    ` : ''}

    <div class="info-card">
      <p style="margin: 0; font-size: 13px; color: #334155;">
        <strong>🔐 Link Expiry:</strong> This reset link will expire in <strong>${expiresMinutes} minutes</strong>. If you did not request a password reset, no action is required and your account remains secure.
      </p>
    </div>
  `;
  return getBaseWrapper('OfferDesk Security - Reset Password', content);
}

/**
 * 3. Drive Announcement Email Template
 */
function getDriveAnnouncementTemplate({ recipientName = 'Student', driveTitle = 'Software Engineer Drive', companyName = 'Tech Corp', role = 'Full Stack Developer', packageInfo = '12 LPA', deadline = 'N/A', location = 'Campus Placement Cell', applyUrl = '#' }) {
  const content = `
    <span class="badge badge-success" style="margin-bottom: 12px;">NEW RECRUITMENT DRIVE</span>
    <h2 style="margin-top: 8px; color: #1e293b; font-size: 22px; font-weight: 800;">${driveTitle}</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Dear <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      A new placement opportunity has been posted by the Training & Placement Cell. Here are the key details:
    </p>

    <table width="100%" style="margin: 20px 0; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-collapse: separate; padding: 16px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 35%;">Company:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${companyName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Role / Designation:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${role}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Package / CTC:</td>
        <td style="padding: 8px 0; color: #00c853; font-size: 14px; font-weight: 800;">${packageInfo}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Application Deadline:</td>
        <td style="padding: 8px 0; color: #dc2626; font-size: 14px; font-weight: 700;">${deadline}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Drive Location:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${location}</td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${applyUrl}" class="btn-primary" target="_blank">View Drive & Apply Now</a>
    </div>
  `;
  return getBaseWrapper(`New Drive Alert: ${companyName} - ${role}`, content);
}

/**
 * 4. Application Status Update Email Template
 */
function getApplicationStatusTemplate({ recipientName = 'Candidate', driveTitle = 'Campus Drive', companyName = 'Company', status = 'Shortlisted', statusColor = 'success', message = '', nextSteps = 'Check your portal dashboard for further instructions.' }) {
  const badgeClass = statusColor === 'danger' ? 'badge-danger' : (statusColor === 'warning' ? 'badge-warning' : 'badge-success');
  const content = `
    <span class="badge ${badgeClass}" style="margin-bottom: 12px; font-size: 13px; padding: 6px 16px;">STATUS: ${status.toUpperCase()}</span>
    <h2 style="margin-top: 8px; color: #1e293b; font-size: 20px; font-weight: 800;">Application Update: ${driveTitle}</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Your application status for <strong>${companyName}</strong> (${driveTitle}) has been updated to:
    </p>

    <div class="info-card" style="background: #f0fdf4; border-left-color: ${statusColor === 'danger' ? '#ef4444' : '#00c853'};">
      <h3 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px;">Current Status: <span style="color: ${statusColor === 'danger' ? '#dc2626' : '#1b5e20'};">${status}</span></h3>
      ${message ? `<p style="margin: 6px 0 0 0; color: #475569; font-size: 13px;">${message}</p>` : ''}
    </div>

    <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin-top: 20px;">Next Steps:</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">${nextSteps}</p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="#" class="btn-primary">Go to OfferDesk Dashboard</a>
    </div>
  `;
  return getBaseWrapper(`Application Status Update - ${companyName}`, content);
}

/**
 * 5. Interview Schedule / Invitation Email Template
 */
function getInterviewInvitationTemplate({ recipientName = 'Candidate', companyName = 'Tech Corp', role = 'Software Engineer', roundName = 'Technical Round 1', date = 'Tomorrow', time = '10:00 AM IST', venueOrLink = 'Google Meet / Placement Hall A', instructions = 'Please keep your resume and college ID card handy.' }) {
  const content = `
    <span class="badge badge-info" style="margin-bottom: 12px;">INTERVIEW INVITATION</span>
    <h2 style="margin-top: 8px; color: #1e293b; font-size: 22px; font-weight: 800;">Interview Scheduled: ${companyName}</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Dear <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Congratulations! You have been invited for <strong>${roundName}</strong> for the role of <strong>${role}</strong> at <strong>${companyName}</strong>.
    </p>

    <table width="100%" style="margin: 20px 0; background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; border-collapse: separate; padding: 18px;">
      <tr>
        <td style="padding: 6px 0; color: #166534; font-size: 13px; width: 35%;">Interview Round:</td>
        <td style="padding: 6px 0; color: #14532d; font-size: 14px; font-weight: 800;">${roundName}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #166534; font-size: 13px;">Date:</td>
        <td style="padding: 6px 0; color: #14532d; font-size: 14px; font-weight: 700;">${date}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #166534; font-size: 13px;">Time:</td>
        <td style="padding: 6px 0; color: #14532d; font-size: 14px; font-weight: 700;">${time}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #166534; font-size: 13px;">Venue / Meeting:</td>
        <td style="padding: 6px 0; color: #14532d; font-size: 14px; font-weight: 700;">${venueOrLink}</td>
      </tr>
    </table>

    <div class="info-card">
      <p style="margin: 0; font-size: 13px; color: #334155;">
        <strong>📝 Preparation Tip:</strong> ${instructions}
      </p>
    </div>
  `;
  return getBaseWrapper(`Interview Call: ${companyName} (${roundName})`, content);
}

/**
 * 6. Offer Letter Issuance & Verification Email Template
 */
function getOfferReleaseTemplate({ recipientName = 'Candidate', companyName = 'Tech Corp', role = 'Software Engineer', CTC = '12 LPA', joiningDate = 'Immediate / Post Graduation', verificationCode = 'OFFER-2026-X99', acceptUrl = '#' }) {
  const content = `
    <span class="badge badge-success" style="margin-bottom: 12px; font-size: 13px; padding: 6px 16px;">🎉 OFFICIAL OFFER RELEASED</span>
    <h2 style="margin-top: 8px; color: #1e293b; font-size: 22px; font-weight: 800;">Congratulations on Your Placement Offer!</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Dear <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      We are delighted to inform you that <strong>${companyName}</strong> has officially issued your offer letter for the position of <strong>${role}</strong>!
    </p>

    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 16px; padding: 24px; text-align: center; border: 1px solid #86efac; margin: 20px 0;">
      <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #166534; font-weight: 700;">Offered Annual Package</p>
      <h1 style="margin: 6px 0; font-size: 36px; color: #15803d; font-weight: 900;">${CTC}</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #166534;">Expected Joining: <strong>${joiningDate}</strong></p>
    </div>

    <div class="code-box" style="font-size: 20px; letter-spacing: 3px;">
      <span style="display: block; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #15803d; margin-bottom: 6px;">Offer Verification Key</span>
      ${verificationCode}
    </div>

    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Please log into your OfferDesk portal to verify, review, and accept your official offer letter.
    </p>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${acceptUrl}" class="btn-primary">Review & Accept Offer</a>
    </div>
  `;
  return getBaseWrapper(`Placement Offer Released: ${companyName} (${CTC})`, content);
}

/**
 * 7. Mentorship & Mock Session Email Template
 */
function getMentorshipBookingTemplate({ recipientName = 'Student', mentorName = 'Alumni Mentor', topic = 'System Design & Mock Interview', sessionDate = 'This Saturday', sessionTime = '4:00 PM IST', meetingLink = '#' }) {
  const content = `
    <span class="badge badge-info" style="margin-bottom: 12px;">MENTORSHIP SESSION BOOKED</span>
    <h2 style="margin-top: 8px; color: #1e293b; font-size: 20px; font-weight: 800;">1-on-1 Mentorship Session Confirmed</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Your mentorship slot with <strong>${mentorName}</strong> has been successfully confirmed.
    </p>

    <table width="100%" style="margin: 20px 0; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px;">
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Topic:</td>
        <td style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${topic}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Date & Time:</td>
        <td style="padding: 6px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${sessionDate} at ${sessionTime}</td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 20px;">
      <a href="${meetingLink}" class="btn-primary">Join Session Link</a>
    </div>
  `;
  return getBaseWrapper(`Mentorship Confirmed: ${topic}`, content);
}

/**
 * 8. Security Alert Email Template
 */
function getSecurityAlertTemplate({ recipientName = 'User', loginTime = new Date().toLocaleString(), device = 'Chrome / Windows 11', ipAddress = '127.0.0.1', location = 'Chennai, India', actionUrl = '#' }) {
  const content = `
    <span class="badge badge-warning" style="margin-bottom: 12px;">SECURITY NOTIFICATION</span>
    <h2 style="margin-top: 8px; color: #1e293b; font-size: 20px; font-weight: 800;">New Account Access Detected</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello <strong>${recipientName}</strong>,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Your OfferDesk account was recently accessed from a new device or location.
    </p>

    <table width="100%" style="margin: 20px 0; background: #fffbebf5; border-radius: 12px; border: 1px solid #fef3c7; padding: 16px;">
      <tr>
        <td style="padding: 6px 0; color: #92400e; font-size: 13px; width: 35%;">Date & Time:</td>
        <td style="padding: 6px 0; color: #78350f; font-size: 13px; font-weight: 700;">${loginTime}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #92400e; font-size: 13px;">Device / Browser:</td>
        <td style="padding: 6px 0; color: #78350f; font-size: 13px; font-weight: 700;">${device}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #92400e; font-size: 13px;">IP Address:</td>
        <td style="padding: 6px 0; color: #78350f; font-size: 13px; font-weight: 700;">${ipAddress}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #92400e; font-size: 13px;">Location:</td>
        <td style="padding: 6px 0; color: #78350f; font-size: 13px; font-weight: 700;">${location}</td>
      </tr>
    </table>

    <div class="info-card" style="background: #fef2f2; border-left-color: #ef4444;">
      <p style="margin: 0; font-size: 13px; color: #991b1b;">
        <strong>Was this not you?</strong> If you did not authorize this login, please secure your account immediately by changing your password.
      </p>
    </div>

    <div style="text-align: center; margin-top: 20px;">
      <a href="${actionUrl}" class="btn-primary" style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);">Secure My Account</a>
    </div>
  `;
  return getBaseWrapper('OfferDesk Security Alert: New Device Login', content);
}

/**
 * 9. Tenant Creation / Institution Onboarding Request Notification Email
 */
function getTenantCreationNotificationTemplate({
  tenantId = 'tenant01',
  name = 'Institution Name',
  code = 'INST',
  domain = 'institution.edu.in',
  plan = 'PRO',
  status = 'PENDING',
  placementOfficerName = 'N/A',
  contactEmail = 'contact@institution.edu.in',
  accreditation = 'NAAC A++',
  submittedAt = new Date().toLocaleString(),
}) {
  const content = `
    <span class="badge badge-info" style="margin-bottom: 12px; font-size: 13px; padding: 6px 16px;">NEW TENANT CREATION REQUEST</span>
    <h2 style="margin-top: 8px; color: #1e293b; font-size: 22px; font-weight: 800;">Institution Onboarding Form Submission</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello Administrator,</p>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      A new university tenant creation request has been submitted. Below are the complete institution details:
    </p>

    <table width="100%" style="margin: 20px 0; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; border-collapse: separate; padding: 18px;">
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 40%;">Generated Tenant ID:</td>
        <td style="padding: 8px 0; color: #1b5e20; font-size: 14px; font-weight: 800;">${tenantId}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Full Institution Name:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Short Code:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${code}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">University Domain:</td>
        <td style="padding: 8px 0; color: #00c853; font-size: 14px; font-weight: 700;">@${domain}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Selected SaaS Plan:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 700;">${plan}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Initial Status:</td>
        <td style="padding: 8px 0; color: #3b82f6; font-size: 14px; font-weight: 700;">${status}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Placement Officer:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${placementOfficerName || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Contact Email:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${contactEmail || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Accreditation:</td>
        <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${accreditation}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Submission Date & Time:</td>
        <td style="padding: 8px 0; color: #64748b; font-size: 13px;">${submittedAt}</td>
      </tr>
    </table>

    <div class="info-card">
      <p style="margin: 0; font-size: 13px; color: #334155;">
        <strong>🚀 System Notification:</strong> This email was automatically generated and dispatched to <code>hello.theoriongd@gmail.com</code> upon completion of the tenant onboarding request form.
      </p>
    </div>
  `;
  return getBaseWrapper(`Tenant Creation Notification: ${name} (${code})`, content);
}

module.exports = {
  getOTPVerificationTemplate,
  getPasswordResetTemplate,
  getDriveAnnouncementTemplate,
  getApplicationStatusTemplate,
  getInterviewInvitationTemplate,
  getOfferReleaseTemplate,
  getMentorshipBookingTemplate,
  getSecurityAlertTemplate,
  getTenantCreationNotificationTemplate,
};

