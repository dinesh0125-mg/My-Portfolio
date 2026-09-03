import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getServices(req, res, next) {
  try {
    const services = await prisma.service.findMany({ orderBy: { displayOrder: 'asc' } });
    return sendSuccess(res, 'Services retrieved', { services });
  } catch (err) {
    next(err);
  }
}

export async function createService(req, res, next) {
  try {
    const { title, description, icon = 'Layers', displayOrder = 0, isActive = true } = req.body;
    const service = await prisma.service.create({
      data: { title, description, icon, displayOrder, isActive },
    });
    return sendSuccess(res, 'Service created', { service }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const service = await prisma.service.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, 'Service updated', { service });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.service.delete({ where: { id } });
    return sendSuccess(res, 'Service deleted');
  } catch (err) {
    next(err);
  }
}
