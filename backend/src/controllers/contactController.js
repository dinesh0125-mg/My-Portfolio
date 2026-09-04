import { prisma } from '../config/database.js';

import {
  sendSuccess,
  sendError,
} from '../utils/response.js';

import {
  sendContactNotificationEmail,
  testSmtpConnection,
} from '../services/mailService.js';


export async function submitContactMessage(req, res, next) {
  try {
    const {
      name,
      email,
      projectType,
      message,
    } = req.body;

    if (!name || !String(name).trim()) {
      return sendError(res, 'Name is required', 400);
    }

    if (!email || !String(email).trim()) {
      return sendError(res, 'Email is required', 400);
    }

    if (!message || !String(message).trim()) {
      return sendError(res, 'Message is required', 400);
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanProjectType = String(
      projectType || 'General Inquiry'
    ).trim();
    const cleanMessage = String(message).trim();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return sendError(
        res,
        'Please provide a valid email address',
        400
      );
    }

    if (cleanName.length > 100) {
      return sendError(res, 'Name is too long', 400);
    }

    if (cleanEmail.length > 255) {
      return sendError(
        res,
        'Email address is too long',
        400
      );
    }

    if (cleanProjectType.length > 150) {
      return sendError(
        res,
        'Project type is too long',
        400
      );
    }

    if (cleanMessage.length > 10000) {
      return sendError(
        res,
        'Message is too long',
        400
      );
    }

    /*
     * Save to PostgreSQL
     */
    const contactMessage =
      await prisma.contactMessage.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          projectType: cleanProjectType,
          message: cleanMessage,
          status: 'NEW',
        },
      });

    console.log(
      `[ContactController] Contact message saved. ID: ${contactMessage.id}`
    );

    /*
     * Send email
     */
    let mailResult;

    try {
      mailResult =
        await sendContactNotificationEmail({
          id: contactMessage.id,
          name: cleanName,
          email: cleanEmail,
          projectType: cleanProjectType,
          message: cleanMessage,
        });
    } catch (mailError) {
      console.error(
        '[ContactController] Email exception:',
        mailError
      );

      mailResult = {
        sent: false,
        error: mailError.message,
        code: mailError.code || null,
      };
    }

    /*
     * Email failed
     */
    if (!mailResult?.sent) {
      console.error(
        '[ContactController] Email failed:',
        mailResult?.error ||
          mailResult?.message ||
          mailResult?.reason ||
          'Unknown error'
      );

      return sendError(
        res,
        'Your message was saved successfully, but the email notification could not be sent. Please try again later.',
        500
      );
    }

    /*
     * Email successful
     */
    console.log(
      '[ContactController] Gmail notification sent successfully.'
    );

    return sendSuccess(
      res,
      'Your message has been sent successfully! Dinesh will get back to you shortly.',
      {
        id: contactMessage.id,
        emailSent: true,
        messageId: mailResult.messageId,
      },
      201
    );

  } catch (err) {
    console.error(
      '[ContactController] Contact submission error:',
      err
    );

    next(err);
  }
}


/* =========================================================
   ADMIN - CONTACT INFO
========================================================= */

export async function getContactInfo(req, res, next) {
  try {
    const contactInfo =
      await prisma.contactInfo.findFirst();

    return sendSuccess(
      res,
      'Contact info retrieved',
      {
        contact: contactInfo,
      }
    );
  } catch (err) {
    next(err);
  }
}


export async function updateContactInfo(req, res, next) {
  try {
    const data = req.body;

    const existing =
      await prisma.contactInfo.findFirst();

    let updated;

    if (existing) {
      updated =
        await prisma.contactInfo.update({
          where: {
            id: existing.id,
          },
          data,
        });
    } else {
      updated =
        await prisma.contactInfo.create({
          data,
        });
    }

    return sendSuccess(
      res,
      'Contact information updated',
      {
        contact: updated,
      }
    );
  } catch (err) {
    next(err);
  }
}


/* =========================================================
   ADMIN - CONTACT MESSAGES
========================================================= */

export async function getContactMessages(
  req,
  res,
  next
) {
  try {
    const messages =
      await prisma.contactMessage.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

    return sendSuccess(
      res,
      'Contact messages retrieved',
      {
        messages,
      }
    );
  } catch (err) {
    next(err);
  }
}


export async function updateContactMessageStatus(
  req,
  res,
  next
) {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return sendError(
        res,
        'Invalid message ID',
        400
      );
    }

    const { status } = req.body;

    const allowedStatuses = [
      'NEW',
      'READ',
      'REPLIED',
      'ARCHIVED',
    ];

    if (!allowedStatuses.includes(status)) {
      return sendError(
        res,
        'Invalid message status',
        400
      );
    }

    const message =
      await prisma.contactMessage.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

    return sendSuccess(
      res,
      'Message status updated',
      {
        message,
      }
    );
  } catch (err) {
    next(err);
  }
}


export async function deleteContactMessage(
  req,
  res,
  next
) {
  try {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return sendError(
        res,
        'Invalid message ID',
        400
      );
    }

    await prisma.contactMessage.delete({
      where: {
        id,
      },
    });

    return sendSuccess(
      res,
      'Contact message deleted'
    );
  } catch (err) {
    next(err);
  }
}


/* =========================================================
   ADMIN - TEST SMTP
========================================================= */

export async function testEmailNotification(
  req,
  res,
  next
) {
  try {
    console.log(
      '[ContactController] Testing Gmail SMTP connection...'
    );

    const result =
      await testSmtpConnection();

    if (!result.success) {
      return sendError(
        res,
        result.message ||
          'Gmail SMTP connection failed.',
        400
      );
    }

    return sendSuccess(
      res,
      'Gmail connection verified successfully!',
      result
    );
  } catch (err) {
    console.error(
      '[ContactController] SMTP test exception:',
      err
    );

    next(err);
  }
}
