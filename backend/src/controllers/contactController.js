import { prisma } from '../config/database.js';

import {
  sendSuccess,
  sendError,
} from '../utils/response.js';

import {
  sendContactNotificationEmail,
  testSmtpConnection,
} from '../services/mailService.js';


/*
 * =========================================================
 * PUBLIC
 * SUBMIT CONTACT MESSAGE
 * =========================================================
 */

export async function submitContactMessage(
  req,
  res,
  next
) {
  try {
    const {
      name,
      email,
      projectType,
      message,
    } = req.body;


    /*
     * -------------------------------------------------------
     * VALIDATION
     * -------------------------------------------------------
     */

    if (!name || !String(name).trim()) {
      return sendError(
        res,
        'Name is required',
        400
      );
    }

    if (!email || !String(email).trim()) {
      return sendError(
        res,
        'Email is required',
        400
      );
    }

    if (!message || !String(message).trim()) {
      return sendError(
        res,
        'Message is required',
        400
      );
    }


    /*
     * -------------------------------------------------------
     * EMAIL VALIDATION
     * -------------------------------------------------------
     */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const rawEmail =
      String(email).trim();

    if (!emailRegex.test(rawEmail)) {
      return sendError(
        res,
        'Please provide a valid email address',
        400
      );
    }


    /*
     * -------------------------------------------------------
     * CLEAN INPUT
     * -------------------------------------------------------
     */

    const cleanName =
      String(name).trim();

    const cleanEmail =
      rawEmail.toLowerCase();

    const cleanProjectType =
      String(
        projectType ||
        'General Inquiry'
      ).trim();

    const cleanMessage =
      String(message).trim();


    /*
     * -------------------------------------------------------
     * OPTIONAL LENGTH VALIDATION
     * -------------------------------------------------------
     */

    if (cleanName.length > 100) {
      return sendError(
        res,
        'Name is too long',
        400
      );
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
     * =======================================================
     * 1. SAVE MESSAGE TO POSTGRESQL
     * =======================================================
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
     * =======================================================
     * 2. SEND GMAIL NOTIFICATION
     * =======================================================
     *
     * IMPORTANT:
     *
     * We WAIT for the mail result.
     *
     * This allows us to know whether Gmail actually
     * accepted the message.
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
        '[ContactController] Gmail notification exception:',
        mailError
      );

      mailResult = {
        sent: false,
        error: mailError.message,
        code: mailError.code || null,
      };
    }


    /*
     * =======================================================
     * 3. CHECK MAIL RESULT
     * =======================================================
     */

    if (!mailResult || !mailResult.sent) {

      console.error(
        '[ContactController] Gmail notification failed:',
        mailResult?.error ||
        mailResult?.message ||
        mailResult?.reason ||
        'Unknown mail error'
      );


      /*
       * IMPORTANT:
       *
       * The contact message remains in PostgreSQL.
       *
       * We DO NOT delete it because the admin dashboard
       * should still contain the visitor's message.
       */

      return sendError(
        res,
        'Your message was saved successfully, but the email notification could not be sent. Please try again later.',
        500
      );
    }


    /*
     * =======================================================
     * 4. EMAIL SUCCESS
     * =======================================================
     */

    console.log(
      `[ContactController] Gmail notification sent successfully.`
    );

    console.log(
      `[ContactController] Message ID: ${contactMessage.id}`
    );

    console.log(
      `[ContactController] Gmail Message ID: ${mailResult.messageId}`
    );


    /*
     * =======================================================
     * 5. FINAL RESPONSE
     * =======================================================
     */

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


/*
 * =========================================================
 * ADMIN
 * GET CONTACT INFORMATION
 * =========================================================
 */

export async function getContactInfo(
  req,
  res,
  next
) {
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


/*
 * =========================================================
 * ADMIN
 * UPDATE CONTACT INFORMATION
 * =========================================================
 */

export async function updateContactInfo(
  req,
  res,
  next
) {
  try {

    const data = req.body;

    const existing =
      await prisma.contactInfo.findFirst();

    let updated;


    /*
     * Update existing contact information
     */

    if (existing) {

      updated =
        await prisma.contactInfo.update({
          where: {
            id: existing.id,
          },

          data,
        });

    }

    /*
     * Create if it doesn't exist
     */

    else {

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


/*
 * =========================================================
 * ADMIN
 * GET ALL CONTACT MESSAGES
 * =========================================================
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


/*
 * =========================================================
 * ADMIN
 * UPDATE CONTACT MESSAGE STATUS
 * =========================================================
 */

export async function updateContactMessageStatus(
  req,
  res,
  next
) {
  try {

    const id =
      parseInt(req.params.id, 10);


    /*
     * Validate ID
     */

    if (Number.isNaN(id)) {

      return sendError(
        res,
        'Invalid message ID',
        400
      );

    }


    const { status } = req.body;


    /*
     * Allowed statuses
     */

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


    /*
     * Update
     */

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


/*
 * =========================================================
 * ADMIN
 * DELETE CONTACT MESSAGE
 * =========================================================
 */

export async function deleteContactMessage(
  req,
  res,
  next
) {
  try {

    const id =
      parseInt(req.params.id, 10);


    /*
     * Validate ID
     */

    if (Number.isNaN(id)) {

      return sendError(
        res,
        'Invalid message ID',
        400
      );

    }


    /*
     * Delete message
     */

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


/*
 * =========================================================
 * ADMIN
 * TEST GMAIL SMTP CONNECTION
 * =========================================================
 */

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


    /*
     * SMTP failed
     */

    if (!result.success) {

      console.error(
        '[ContactController] Gmail SMTP test failed:',
        result.message
      );


      return sendError(
        res,
        result.message ||
        'Gmail SMTP connection failed.',
        400
      );

    }


    /*
     * SMTP successful
     */

    console.log(
      '[ContactController] Gmail SMTP test successful.'
    );


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
