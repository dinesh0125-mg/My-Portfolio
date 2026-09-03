import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

export async function getSettings(req, res, next) {
  try {
    const settings = await prisma.settings.findFirst();
    return sendSuccess(res, 'Settings retrieved', { settings });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const data = req.body;
    const existing = await prisma.settings.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.settings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      updated = await prisma.settings.create({ data });
    }

    return sendSuccess(res, 'Settings updated successfully', { settings: updated });
  } catch (err) {
    next(err);
  }
}
