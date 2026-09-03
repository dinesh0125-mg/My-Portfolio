import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Public endpoint: Submit inquiry message
export async function submitContactMessage(req, res, next) {
  try {
    const { name, email, projectType, message } = req.body;
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        projectType: projectType || 'General Inquiry',
        message,
        status: 'NEW',
      },
    });

    return sendSuccess(res, 'Your message has been received! Dinesh will reach out shortly.', { id: contactMessage.id }, 201);
  } catch (err) {
    next(err);
  }
}

// Admin: Get contact channels
export async function getContactInfo(req, res, next) {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();
    return sendSuccess(res, 'Contact info retrieved', { contact: contactInfo });
  } catch (err) {
    next(err);
  }
}

// Admin: Update contact channels
export async function updateContactInfo(req, res, next) {
  try {
    const data = req.body;
    const existing = await prisma.contactInfo.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.contactInfo.update({
        where: { id: existing.id },
        data,
      });
    } else {
      updated = await prisma.contactInfo.create({ data });
    }

    return sendSuccess(res, 'Contact information updated', { contact: updated });
  } catch (err) {
    next(err);
  }
}

// Admin: Get all recruiter contact messages
export async function getContactMessages(req, res, next) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Contact messages retrieved', { messages });
  } catch (err) {
    next(err);
  }
}

// Admin: Update message status (NEW, READ, REPLIED, ARCHIVED)
export async function updateContactMessageStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
    return sendSuccess(res, 'Message status updated', { message });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete message
export async function deleteContactMessage(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.contactMessage.delete({ where: { id } });
    return sendSuccess(res, 'Contact message deleted');
  } catch (err) {
    next(err);
  }
}
