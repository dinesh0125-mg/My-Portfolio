import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getHero(req, res, next) {
  try {
    const hero = await prisma.hero.findFirst();
    return sendSuccess(res, 'Hero data retrieved', { hero });
  } catch (err) {
    next(err);
  }
}

export async function updateHero(req, res, next) {
  try {
    const data = req.body;
    const existing = await prisma.hero.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.hero.update({
        where: { id: existing.id },
        data,
      });
    } else {
      updated = await prisma.hero.create({ data });
    }

    await prisma.adminActivity.create({
      data: {
        adminId: req.admin?.id,
        action: 'HERO_UPDATED',
        entity: 'HERO',
        entityId: String(updated.id),
        details: `Updated hero headline and metadata`,
      },
    });

    return sendSuccess(res, 'Hero section updated successfully', { hero: updated });
  } catch (err) {
    next(err);
  }
}
