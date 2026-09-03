import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

export async function getProcess(req, res, next) {
  try {
    const processSteps = await prisma.process.findMany({ orderBy: { stepNumber: 'asc' } });
    return sendSuccess(res, 'Process steps retrieved', { process: processSteps });
  } catch (err) {
    next(err);
  }
}

export async function createProcess(req, res, next) {
  try {
    const item = await prisma.process.create({ data: req.body });
    return sendSuccess(res, 'Process step created', { process: item }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProcess(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await prisma.process.update({ where: { id }, data: req.body });
    return sendSuccess(res, 'Process step updated', { process: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteProcess(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.process.delete({ where: { id } });
    return sendSuccess(res, 'Process step deleted');
  } catch (err) {
    next(err);
  }
}
