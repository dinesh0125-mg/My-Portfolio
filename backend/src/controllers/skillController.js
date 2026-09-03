import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getSkills(req, res, next) {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { displayOrder: 'asc' } });
    return sendSuccess(res, 'Skills retrieved', { skills });
  } catch (err) {
    next(err);
  }
}

export async function createSkill(req, res, next) {
  try {
    const { name, category, icon, note, highlight = false, displayOrder = 0, isActive = true } = req.body;
    const skill = await prisma.skill.create({
      data: { name, category, icon, note, highlight, displayOrder, isActive },
    });
    return sendSuccess(res, 'Skill created', { skill }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateSkill(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const skill = await prisma.skill.update({
      where: { id },
      data: req.body,
    });
    return sendSuccess(res, 'Skill updated', { skill });
  } catch (err) {
    next(err);
  }
}

export async function deleteSkill(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.skill.delete({ where: { id } });
    return sendSuccess(res, 'Skill deleted');
  } catch (err) {
    next(err);
  }
}
