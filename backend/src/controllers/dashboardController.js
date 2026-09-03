import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

export async function getDashboardStats(req, res, next) {
  try {
    const [
      totalProjects,
      totalServices,
      totalSkills,
      totalExperience,
      totalCertificates,
      totalEducation,
      totalMessages,
      unreadMessages,
      recentActivity,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.certificate.count(),
      prisma.education.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
      prisma.adminActivity.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return sendSuccess(res, 'Dashboard statistics retrieved', {
      stats: {
        totalProjects,
        totalServices,
        totalSkills,
        totalExperience,
        totalCertificates,
        totalEducation,
        totalMessages,
        unreadMessages,
      },
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
}
