import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import {
  sendContactNotificationEmail,
  testSmtpConnection,
} from '../services/mailService.js';

/**
 * Public endpoint:
 * Submit inquiry message
 */
export async function submitContactMessage(req, res, next) {
  try {
    const {
      name,
      email,
      projectType,
      message,
    } = req.body;

    // --------------------------------------------------
    // Validation
    // --------------------------------------------------

    if (!name || !String(name).trim()) {
      return sendError(res, 'Name is required', 400);
    }

    if (!email || !String(email).trim()) {
      return sendError(res, 'Email is required', 400);
    }

    if (!message || !String(message).trim()) {
      return sendError(res, 'Message is required', 400);
    }

    // Basic email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(String(email).trim())) {
      return sendError(
        res,
        'Please provide a valid email address',
        400
      );
    }

    // --------------------------------------------------
    // Clean input
    // --------------------------------------------------

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    const cleanProjectType =
      String(
        projectType || 'General Inquiry'
      ).trim();

    const cleanMessage =
      String(message).trim();

    // --------------------------------------------------
    // 1. Save message to PostgreSQL
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 2. Send Gmail notification
    // --------------------------------------------------

    const mailResult =
      await sendContactNotificationEmail({
        id: contactMessage.id,
        name: cleanName,
        email: cleanEmail,
        projectType: cleanProjectType,
        message: cleanMessage,
      });

    // --------------------------------------------------
    // 3. Check whether Gmail was actually sent
    // --------------------------------------------------

    if (!mailResult.sent) {
      console.error(
        '[ContactController] Gmail notification failed:',
        mailResult.error || mailResult.message
      );

      /*
       * IMPORTANT:
       *
       * Message is already saved in PostgreSQL,
       * so we don't delete it.
       *
       * But we tell frontend that email notification
       * could not be sent.
       */

      return sendError(
        res,
        'Your message was saved successfully, but the email notification could not be sent. Please try again later.',
        500
      );
    }

    // --------------------------------------------------
    // 4. Gmail successfully sent
    // --------------------------------------------------

    console.log(
      `[ContactController] Gmail notification sent successfully for message ID: ${contactMessage.id}`
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


/**
 * Admin:
 * Get contact information
 */
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


/**
 * Admin:
 * Update contact information
 */
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


/**
 * Admin:
 * Get all contact messages
 */
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


/**
 * Admin:
 * Update contact message status
 */
export async function updateContactMessageStatus(
  req,
  res,
  next
) {
  try {
    const id =
      parseInt(req.params.id, 10);

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


/**
 * Admin:
 * Delete contact message
 */
export async function deleteContactMessage(
  req,
  res,
  next
) {
  try {
    const id =
      parseInt(req.params.id, 10);

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


/**
 * Admin:
 * Test Gmail SMTP connection
 */
export async function testEmailNotification(
  req,
  res,
  next
) {
  try {
    const result =
      await testSmtpConnection();

    if (!result.success) {
      return sendError(
        res,
        result.message,
        400
      );
    }

    return sendSuccess(
      res,
      'Gmail connection verified successfully!',
      result
    );

  } catch (err) {
    next(err);
  }
}
