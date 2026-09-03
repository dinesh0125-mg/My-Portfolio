import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

export async function getPublicPortfolio(req, res, next) {
  try {
    const [
      hero,
      about,
      services,
      projects,
      skills,
      experience,
      education,
      certificates,
      processSteps,
      pricingPlans,
      contactInfo,
      settings,
    ] = await Promise.all([
      prisma.hero.findFirst(),
      prisma.about.findFirst({
        include: {
          highlights: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.project.findMany({
        where: { isActive: true },
        include: {
          technologies: {
            include: { technology: true },
          },
        },
        orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
      }),
      prisma.skill.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.experience.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.education.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.certificate.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.process.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.pricing.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.contactInfo.findFirst(),
      prisma.settings.findFirst(),
    ]);

    // Format projects to flatten technologies array
    const formattedProjects = projects.map((p) => ({
      ...p,
      technologies: p.technologies.map((pt) => pt.technology.name),
    }));

    // Group skills by category for frontend convenience
    const skillsByCategory = skills.reduce((acc, s) => {
      const cat = s.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});

    return sendSuccess(res, 'Public portfolio data retrieved successfully', {
      hero,
      about,
      services,
      projects: formattedProjects,
      skills: skillsByCategory,
      rawSkills: skills,
      experience,
      education,
      certificates,
      process: processSteps,
      pricing: pricingPlans,
      contact: contactInfo,
      settings,
    });
  } catch (err) {
    next(err);
  }
}
