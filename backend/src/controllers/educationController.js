import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getEducation(req, res, next) {
  try {
    const education = await prisma.education.findMany({ orderBy: { displayOrder: 'asc' } });
    return sendSuccess(res, 'Education records retrieved', { education });
  } catch (err) {
    next(err);
  }
}

export async function createEducation(req, res, next) {
  try {
    const edu = await prisma.education.create({ data: req.body });
    return sendSuccess(res, 'Education record created', { education: edu }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateEducation(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const edu = await prisma.education.update({ where: { id }, data: req.body });
    return sendSuccess(res, 'Education record updated', { education: edu });
  } catch (err) {
    next(err);
  }
}

export async function deleteEducation(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.education.delete({ where: { id } });
    return sendSuccess(res, 'Education record deleted');
  } catch (err) {
    next(err);
  }
}
