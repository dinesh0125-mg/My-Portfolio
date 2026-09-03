import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getExperience(req, res, next) {
  try {
    const experience = await prisma.experience.findMany({ orderBy: { displayOrder: 'asc' } });
    return sendSuccess(res, 'Experience retrieved', { experience });
  } catch (err) {
    next(err);
  }
}

export async function createExperience(req, res, next) {
  try {
    const exp = await prisma.experience.create({ data: req.body });
    return sendSuccess(res, 'Experience entry created', { experience: exp }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateExperience(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const exp = await prisma.experience.update({ where: { id }, data: req.body });
    return sendSuccess(res, 'Experience entry updated', { experience: exp });
  } catch (err) {
    next(err);
  }
}

export async function deleteExperience(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.experience.delete({ where: { id } });
    return sendSuccess(res, 'Experience entry deleted');
  } catch (err) {
    next(err);
  }
}
