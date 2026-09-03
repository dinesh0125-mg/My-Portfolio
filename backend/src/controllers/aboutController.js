import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

export async function getAbout(req, res, next) {
  try {
    const about = await prisma.about.findFirst({
      include: {
        highlights: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    return sendSuccess(res, 'About data retrieved', { about });
  } catch (err) {
    next(err);
  }
}

export async function updateAbout(req, res, next) {
  try {
    const { heading, description, imageUrl, imagePublicId, additionalInfo, highlights } = req.body;
    const existing = await prisma.about.findFirst();

    const aboutId = existing?.id;

    // Use Prisma transaction to ensure atomicity
    const updated = await prisma.$transaction(async (tx) => {
      let currentAbout;
      if (aboutId) {
        currentAbout = await tx.about.update({
          where: { id: aboutId },
          data: { heading, description, imageUrl, imagePublicId, additionalInfo },
        });
      } else {
        currentAbout = await tx.about.create({
          data: { heading, description, imageUrl, imagePublicId, additionalInfo },
        });
      }

      if (Array.isArray(highlights)) {
        await tx.aboutHighlight.deleteMany({ where: { aboutId: currentAbout.id } });
        for (let i = 0; i < highlights.length; i++) {
          const h = highlights[i];
          await tx.aboutHighlight.create({
            data: {
              aboutId: currentAbout.id,
              title: h.title,
              description: h.description || h.desc,
              icon: h.icon || 'Layers',
              displayOrder: h.displayOrder || i + 1,
            },
          });
        }
      }

      return tx.about.findUnique({
        where: { id: currentAbout.id },
        include: { highlights: { orderBy: { displayOrder: 'asc' } } },
      });
    });

    await prisma.adminActivity.create({
      data: {
        adminId: req.admin?.id,
        action: 'ABOUT_UPDATED',
        entity: 'ABOUT',
        entityId: String(updated.id),
        details: 'Updated about narrative and highlight cards',
      },
    });

    return sendSuccess(res, 'About section updated successfully', { about: updated });
  } catch (err) {
    next(err);
  }
}
