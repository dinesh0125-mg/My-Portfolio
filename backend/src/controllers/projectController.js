import { prisma } from '../config/database.js';
import { cloudinaryService } from '../services/cloudinaryService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getProjects(req, res, next) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        technologies: {
          include: { technology: true },
        },
      },
      orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
    });

    const formatted = projects.map((p) => ({
      ...p,
      technologies: p.technologies.map((pt) => pt.technology.name),
    }));

    return sendSuccess(res, 'Projects retrieved', { projects: formatted });
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: {
          include: { technology: true },
        },
      },
    });

    if (!project) {
      return sendError(res, 'Project not found', [], 404);
    }

    const formatted = {
      ...project,
      technologies: project.technologies.map((pt) => pt.technology.name),
    };

    return sendSuccess(res, 'Project details retrieved', { project: formatted });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const {
      title,
      category,
      shortDescription,
      description,
      problemSolved,
      myContribution,
      developmentApproach,
      imageUrl,
      imagePublicId,
      githubUrl,
      liveDemoUrl,
      featured = false,
      displayOrder = 0,
      isActive = true,
      technologies = [],
    } = req.body;

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const project = await prisma.$transaction(async (tx) => {
      const newProj = await tx.project.create({
        data: {
          title,
          slug,
          category,
          shortDescription,
          description,
          problemSolved,
          myContribution,
          developmentApproach,
          imageUrl,
          imagePublicId,
          githubUrl,
          liveDemoUrl,
          featured,
          displayOrder,
          isActive,
        },
      });

      if (Array.isArray(technologies) && technologies.length > 0) {
        for (const techName of technologies) {
          const trimmed = techName.trim();
          if (!trimmed) continue;

          let tech = await tx.technology.findUnique({ where: { name: trimmed } });
          if (!tech) {
            tech = await tx.technology.create({
              data: { name: trimmed, category: 'Engineering' },
            });
          }

          await tx.projectTechnology.create({
            data: {
              projectId: newProj.id,
              technologyId: tech.id,
            },
          });
        }
      }

      return tx.project.findUnique({
        where: { id: newProj.id },
        include: {
          technologies: {
            include: { technology: true },
          },
        },
      });
    });

    await prisma.adminActivity.create({
      data: {
        adminId: req.admin?.id,
        action: 'PROJECT_CREATED',
        entity: 'PROJECT',
        entityId: String(project.id),
        details: `Created project "${project.title}"`,
      },
    });

    const formatted = {
      ...project,
      technologies: project.technologies.map((pt) => pt.technology.name),
    };

    return sendSuccess(res, 'Project created successfully', { project: formatted }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Project not found', [], 404);
    }

    const {
      title,
      category,
      shortDescription,
      description,
      problemSolved,
      myContribution,
      developmentApproach,
      imageUrl,
      imagePublicId,
      githubUrl,
      liveDemoUrl,
      featured,
      displayOrder,
      isActive,
      technologies,
    } = req.body;

    const project = await prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id },
        data: {
          title,
          category,
          shortDescription,
          description,
          problemSolved,
          myContribution,
          developmentApproach,
          imageUrl,
          imagePublicId,
          githubUrl,
          liveDemoUrl,
          featured,
          displayOrder,
          isActive,
        },
      });

      if (Array.isArray(technologies)) {
        await tx.projectTechnology.deleteMany({ where: { projectId: id } });

        for (const techName of technologies) {
          const trimmed = techName.trim();
          if (!trimmed) continue;

          let tech = await tx.technology.findUnique({ where: { name: trimmed } });
          if (!tech) {
            tech = await tx.technology.create({
              data: { name: trimmed, category: 'Engineering' },
            });
          }

          await tx.projectTechnology.create({
            data: {
              projectId: id,
              technologyId: tech.id,
            },
          });
        }
      }

      return tx.project.findUnique({
        where: { id },
        include: {
          technologies: {
            include: { technology: true },
          },
        },
      });
    });

    // If image changed, clean up previous Cloudinary asset
    if (imagePublicId && existing.imagePublicId && existing.imagePublicId !== imagePublicId) {
      cloudinaryService.deleteAsset(existing.imagePublicId).catch(() => {});
    }

    await prisma.adminActivity.create({
      data: {
        adminId: req.admin?.id,
        action: 'PROJECT_UPDATED',
        entity: 'PROJECT',
        entityId: String(project.id),
        details: `Updated project "${project.title}"`,
      },
    });

    const formatted = {
      ...project,
      technologies: project.technologies.map((pt) => pt.technology.name),
    };

    return sendSuccess(res, 'Project updated successfully', { project: formatted });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return sendError(res, 'Project not found', [], 404);
    }

    await prisma.project.delete({ where: { id } });

    // Clean up Cloudinary asset
    if (existing.imagePublicId) {
      await cloudinaryService.deleteAsset(existing.imagePublicId);
    }

    await prisma.adminActivity.create({
      data: {
        adminId: req.admin?.id,
        action: 'PROJECT_DELETED',
        entity: 'PROJECT',
        entityId: String(id),
        details: `Deleted project "${existing.title}"`,
      },
    });

    return sendSuccess(res, 'Project deleted successfully');
  } catch (err) {
    next(err);
  }
}
