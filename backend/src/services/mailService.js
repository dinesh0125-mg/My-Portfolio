import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

/**
 * Escapes HTML characters to prevent XSS injection in email clients
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Fetches SMTP credentials with dynamic fallback to .env
 */
function getEmailConfig() {
  try {
    dotenv.config();
  } catch {
    // ignore
  }

  const user = (process.env.SMTP_USER || ENV.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || ENV.SMTP_PASS || '').trim().replace(/\s+/g, '');
  const receiver = (process.env.NOTIFICATION_RECEIVER_EMAIL || ENV.NOTIFICATION_RECEIVER_EMAIL || 'dineshdinesh48376@gmail.com').trim();

  return { user, pass, receiver };
}

/**
 * Creates and returns a Nodemailer transporter instance
 */
function createTransporter() {
  const { user, pass } = getEmailConfig();

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends an email notification to Dinesh's Gmail whenever a visitor submits the public contact form
 * @param {Object} data - { id, name, email, projectType, message }
 * @returns {Promise<Object>}
 */
export async function sendContactNotificationEmail({ id, name, email, projectType, message }) {
  const receiverEmail = ENV.NOTIFICATION_RECEIVER_EMAIL || 'dineshdinesh48376@gmail.com';
  const senderName = name || 'Anonymous Recruiter';
  const senderEmail = email || 'no-reply@example.com';
  const topic = projectType || 'General Inquiry';
  const cleanMessage = message || '';

  const transporter = createTransporter();

  // If SMTP is not yet configured with an App Password, log instructions cleanly
  if (!transporter) {
    console.log('\n======================================================');
    console.log('📬 [MailService] NEW CONTACT MESSAGE RECEIVED');
    console.log(`From:    ${senderName} <${senderEmail}>`);
    console.log(`Topic:   ${topic}`);
    console.log(`Message: ${cleanMessage}`);
    console.log(`Target:  ${receiverEmail}`);
    console.log('------------------------------------------------------');
    console.log('⚠️ [MailService] SMTP credentials not set in backend/.env');
    console.log('To receive inquiries directly in your Gmail inbox:');
    console.log('1. Go to https://myaccount.google.com/apppasswords');
    console.log('2. Create an App Password for "Portfolio"');
    console.log('3. Put your 16-character password in backend/.env:');
    console.log('   SMTP_USER=' + (ENV.SMTP_USER || 'dineshdinesh48376@gmail.com'));
    console.log('   SMTP_PASS=your_16_char_app_password');
    console.log('======================================================\n');
    return {
      sent: false,
      reason: 'SMTP_CREDENTIALS_MISSING',
      message: 'Email credentials not yet set in .env. Message saved to database.',
    };
  }

  const subject = `📬 New Portfolio Inquiry from ${senderName}: ${topic}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      margin: 0;
      padding: 24px 12px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
    }
    .email-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 32px 28px;
      border-bottom: 2px solid #0d9488;
    }
    .badge {
      display: inline-block;
      background: rgba(20, 184, 166, 0.2);
      color: #2dd4bf;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      border: 1px solid rgba(45, 212, 191, 0.35);
    }
    .header-title {
      margin: 0;
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
      color: #ffffff;
    }
    .email-body {
      padding: 28px;
    }
    .info-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }
    .field-row {
      margin-bottom: 14px;
    }
    .field-row:last-child {
      margin-bottom: 0;
    }
    .field-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .field-value {
      font-size: 15px;
      color: #0f172a;
      font-weight: 600;
    }
    .field-link {
      color: #0d9488;
      text-decoration: none;
      font-weight: 600;
    }
    .field-link:hover {
      text-decoration: underline;
    }
    .message-title {
      font-size: 12px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .message-bubble {
      background-color: #f0fdfa;
      border: 1px solid #ccfbf1;
      border-left: 4px solid #0d9488;
      border-radius: 12px;
      padding: 18px;
      font-size: 14px;
      line-height: 1.65;
      color: #134e4a;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .cta-area {
      text-align: center;
      margin-top: 26px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .reply-button {
      display: inline-block;
      background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
      color: #ffffff !important;
      font-weight: 700;
      font-size: 14px;
      padding: 12px 28px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(13, 148, 136, 0.35);
    }
    .email-footer {
      background-color: #f8fafc;
      padding: 18px 24px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="badge">Website Contact Form</div>
      <h1 class="header-title">New Message from ${escapeHtml(senderName)}</h1>
    </div>

    <div class="email-body">
      <div class="info-card">
        <div class="field-row">
          <div class="field-label">Sender</div>
          <div class="field-value">${escapeHtml(senderName)}</div>
        </div>
        <div class="field-row">
          <div class="field-label">Email Address</div>
          <div class="field-value">
            <a href="mailto:${escapeHtml(senderEmail)}" class="field-link">${escapeHtml(senderEmail)}</a>
          </div>
        </div>
        <div class="field-row">
          <div class="field-label">Inquiry Subject</div>
          <div class="field-value">${escapeHtml(topic)}</div>
        </div>
      </div>

      <div>
        <div class="message-title">Message Body</div>
        <div class="message-bubble">${escapeHtml(cleanMessage)}</div>
      </div>

      <div class="cta-area">
        <a href="mailto:${escapeHtml(senderEmail)}?subject=Re:%20${encodeURIComponent(topic)}" class="reply-button">
          ✉️ Reply to ${escapeHtml(senderName)}
        </a>
      </div>
    </div>

    <div class="email-footer">
      This notification was automatically delivered to your Gmail inbox from your personal portfolio.<br>
      Stored in MySQL database with reference ID: #${escapeHtml(String(id || 'N/A'))}
    </div>
  </div>
</body>
</html>
`;

  const plainText = `
New Portfolio Contact Message
==============================
From:    ${senderName} (${senderEmail})
Subject: ${topic}
Date:    ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}

Message:
${cleanMessage}

------------------------------
Reply directly by writing to: ${senderEmail}
Saved in MySQL database reference #${id || 'N/A'}
`;

  try {
    const info = await transporter.sendMail({
      from: `"Dinesh Portfolio Alert" <${ENV.SMTP_USER}>`,
      to: receiverEmail,
      replyTo: senderEmail,
      subject,
      text: plainText,
      html: htmlContent,
    });

    console.log(`[MailService] ✅ Contact email successfully forwarded to ${receiverEmail} (Msg ID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MailService] ❌ Failed to send email to ${receiverEmail}:`, error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * Tests Gmail SMTP connection
 */
export async function testSmtpConnection() {
  const transporter = createTransporter();
  if (!transporter) {
    return { success: false, message: 'SMTP credentials missing in backend/.env' };
  }
  try {
    await transporter.verify();
    return { success: true, message: 'Gmail SMTP connection verified successfully!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
