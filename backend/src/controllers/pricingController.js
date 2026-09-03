import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

export async function getPricing(req, res, next) {
  try {
    const pricing = await prisma.pricing.findMany({ orderBy: { displayOrder: 'asc' } });
    return sendSuccess(res, 'Pricing plans retrieved', { pricing });
  } catch (err) {
    next(err);
  }
}

export async function createPricing(req, res, next) {
  try {
    const item = await prisma.pricing.create({ data: req.body });
    return sendSuccess(res, 'Pricing plan created', { pricing: item }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updatePricing(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await prisma.pricing.update({ where: { id }, data: req.body });
    return sendSuccess(res, 'Pricing plan updated', { pricing: item });
  } catch (err) {
    next(err);
  }
}

export async function deletePricing(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.pricing.delete({ where: { id } });
    return sendSuccess(res, 'Pricing plan deleted');
  } catch (err) {
    next(err);
  }
}
