import dotenv from 'dotenv';
import { ENV } from '../config/env.js';

dotenv.config();

function escapeHtml(text) {
  if (text === null || text === undefined) {
    return '';
  }

  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getEmailConfig() {
  const apiKey = (
    process.env.RESEND_API_KEY ||
    ENV.RESEND_API_KEY ||
    ''
  ).trim();

  const receiver = (
    process.env.NOTIFICATION_RECEIVER_EMAIL ||
    ENV.NOTIFICATION_RECEIVER_EMAIL ||
    'dineshdinesh48376@gmail.com'
  ).trim();

  const sender = (
    process.env.EMAIL_FROM ||
    ENV.EMAIL_FROM ||
    'Dinesh Portfolio <onboarding@resend.dev>'
  ).trim();

  return {
    apiKey,
    receiver,
    sender,
  };
}

export async function sendContactNotificationEmail({
  id,
  name,
  email,
  projectType,
  message,
}) {
  const {
    apiKey,
    receiver,
    sender,
  } = getEmailConfig();

  if (!apiKey) {
    console.error(
      '[MailService] RESEND_API_KEY is missing.'
    );

    return {
      sent: false,
      reason: 'RESEND_API_KEY_MISSING',
      message: 'RESEND_API_KEY is not configured.',
    };
  }

  const senderName =
    String(name || 'Anonymous Visitor').trim();

  const senderEmail =
    String(email || 'no-reply@example.com').trim();

  const topic =
    String(projectType || 'General Inquiry').trim();

  const cleanMessage =
    String(message || '').trim();

  const subject =
    `New Portfolio Inquiry from ${senderName}: ${topic}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>

<body
  style="
    margin:0;
    padding:24px;
    background:#f1f5f9;
    font-family:Arial,Helvetica,sans-serif;
    color:#0f172a;
  "
>

<div
  style="
    max-width:600px;
    margin:0 auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    border:1px solid #e2e8f0;
  "
>

<div
  style="
    padding:28px;
    background:#0f172a;
    color:#ffffff;
  "
>
  <div
    style="
      display:inline-block;
      padding:6px 12px;
      border-radius:20px;
      background:#134e4a;
      color:#5eead4;
      font-size:11px;
      font-weight:700;
      letter-spacing:.5px;
      text-transform:uppercase;
    "
  >
    Website Contact Form
  </div>

  <h1
    style="
      margin:14px 0 0;
      font-size:24px;
      line-height:1.3;
      color:#ffffff;
    "
  >
    New Portfolio Message
  </h1>
</div>

<div style="padding:28px;">

<div
  style="
    padding:20px;
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:12px;
  "
>

<div style="margin-bottom:16px;">
  <div
    style="
      margin-bottom:5px;
      color:#64748b;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    "
  >
    Name
  </div>

  <div
    style="
      font-size:16px;
      font-weight:600;
      color:#0f172a;
    "
  >
    ${escapeHtml(senderName)}
  </div>
</div>

<div style="margin-bottom:16px;">
  <div
    style="
      margin-bottom:5px;
      color:#64748b;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    "
  >
    Email
  </div>

  <div style="font-size:16px;font-weight:600;">
    <a
      href="mailto:${escapeHtml(senderEmail)}"
      style="
        color:#0d9488;
        text-decoration:none;
      "
    >
      ${escapeHtml(senderEmail)}
    </a>
  </div>
</div>

<div>
  <div
    style="
      margin-bottom:5px;
      color:#64748b;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
    "
  >
    Subject
  </div>

  <div
    style="
      font-size:16px;
      font-weight:600;
      color:#0f172a;
    "
  >
    ${escapeHtml(topic)}
  </div>
</div>

</div>

<div style="margin-top:24px;">

<div
  style="
    margin-bottom:8px;
    color:#475569;
    font-size:11px;
    font-weight:700;
    text-transform:uppercase;
  "
>
  Message
</div>

<div
  style="
    padding:18px;
    background:#f0fdfa;
    border:1px solid #ccfbf1;
    border-left:4px solid #0d9488;
    border-radius:10px;
    color:#134e4a;
    font-size:15px;
    line-height:1.7;
    white-space:pre-wrap;
    word-break:break-word;
  "
>
${escapeHtml(cleanMessage)}
</div>

</div>

<div
  style="
    margin-top:28px;
    padding-top:20px;
    border-top:1px solid #e2e8f0;
    text-align:center;
  "
>
<a
  href="mailto:${escapeHtml(senderEmail)}?subject=${encodeURIComponent(
    `Re: ${topic}`
  )}"
  style="
    display:inline-block;
    padding:12px 24px;
    background:#0d9488;
    color:#ffffff;
    text-decoration:none;
    border-radius:10px;
    font-weight:700;
    font-size:14px;
  "
>
  Reply to ${escapeHtml(senderName)}
</a>
</div>

</div>

<div
  style="
    padding:18px 24px;
    background:#f8fafc;
    border-top:1px solid #e2e8f0;
    color:#94a3b8;
    font-size:11px;
    text-align:center;
    line-height:1.5;
  "
>
Portfolio Contact Notification
<br>
Message ID: #${escapeHtml(String(id || 'N/A'))}
</div>

</div>

</body>
</html>
`;

  const plainText = `
New Portfolio Contact Message

Name:
${senderName}

Email:
${senderEmail}

Subject:
${topic}

Message:
${cleanMessage}

Message ID:
#${id || 'N/A'}
`;

  try {
    console.log(
      `[MailService] Sending contact email to ${receiver}...`
    );

    const response = await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: sender,
          to: [receiver],
          reply_to: senderEmail,
          subject,
          text: plainText,
          html: htmlContent,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        '[MailService] Resend API failed:',
        result
      );

      return {
        sent: false,
        error:
          result?.message ||
          'Resend email delivery failed.',
        code: result?.name || null,
      };
    }

    console.log(
      '[MailService] Email sent successfully.'
    );

    console.log(
      `[MailService] Resend Message ID: ${result.id}`
    );

    return {
      sent: true,
      messageId: result.id,
      receiver,
    };

  } catch (error) {
    console.error(
      '[MailService] Resend request failed:',
      error.message
    );

    return {
      sent: false,
      error: error.message,
      code: error.code || null,
    };
  }
}

export async function testEmailConnection() {
  const { apiKey } = getEmailConfig();

  if (!apiKey) {
    return {
      success: false,
      message: 'RESEND_API_KEY is missing.',
    };
  }

  try {
    const response = await fetch(
      'https://api.resend.com/domains',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          result?.message ||
          'Resend API connection failed.',
      };
    }

    return {
      success: true,
      message: 'Resend API connection verified successfully.',
    };

  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
