import { cloudinaryService } from '../services/cloudinaryService.js';
import { prisma } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function uploadProfile(req, res, next) {
  try {
    if (!req.file) {
      return sendError(res, 'No image file uploaded', [], 400);
    }

    const hero = await prisma.hero.findFirst();
    const oldPublicId = hero?.profileImagePublicId;

    const uploaded = await cloudinaryService.replaceAsset(req.file.buffer, oldPublicId, {
      folder: 'portfolio/profile',
      resource_type: 'image',
    });

    if (hero) {
      await prisma.hero.update({
        where: { id: hero.id },
        data: {
          profileImageUrl: uploaded.url,
          profileImagePublicId: uploaded.publicId,
        },
      });
    }

    await prisma.adminActivity.create({
      data: {
        adminId: req.admin?.id,
        action: 'PROFILE_IMAGE_UPDATED',
        entity: 'HERO',
        details: 'Uploaded new profile photo to Cloudinary',
      },
    });

    return sendSuccess(res, 'Profile photo uploaded successfully', uploaded);
  } catch (err) {
    next(err);
  }
}

export async function uploadProject(req, res, next) {
  try {
    if (!req.file) {
      return sendError(res, 'No image file uploaded', [], 400);
    }

    const uploaded = await cloudinaryService.uploadStream(req.file.buffer, {
      folder: 'portfolio/projects',
      resource_type: 'image',
    });

    return sendSuccess(res, 'Project image uploaded successfully', uploaded);
  } catch (err) {
    next(err);
  }
}

export async function uploadCertificate(req, res, next) {
  try {
    if (!req.file) {
      return sendError(res, 'No certificate file uploaded', [], 400);
    }

    const uploaded = await cloudinaryService.uploadStream(req.file.buffer, {
      folder: 'portfolio/certificates',
      resource_type: 'image',
    });

    return sendSuccess(res, 'Certificate image uploaded successfully', uploaded);
  } catch (err) {
    next(err);
  }
}

export async function uploadResumeFile(req, res, next) {
  try {
    if (!req.file) {
      return sendError(res, 'No resume PDF file uploaded', [], 400);
    }

    const hero = await prisma.hero.findFirst();
    const oldPublicId = hero?.resumePublicId;

    const uploaded = await cloudinaryService.replaceAsset(req.file.buffer, oldPublicId, {
      folder: 'portfolio/resume',
      resource_type: 'raw',
    });

    if (hero) {
      await prisma.hero.update({
        where: { id: hero.id },
        data: {
          resumeUrl: uploaded.url,
          resumePublicId: uploaded.publicId,
        },
      });
    }

    // Also update settings resume
    const settings = await prisma.settings.findFirst();
    if (settings) {
      await prisma.settings.update({
        where: { id: settings.id },
        data: {
          resumeUrl: uploaded.url,
          resumePublicId: uploaded.publicId,
        },
      });
    }

    await prisma.adminActivity.create({
      data: {
        adminId: req.admin?.id,
        action: 'RESUME_UPDATED',
        entity: 'RESUME',
        details: 'Uploaded new resume PDF to Cloudinary',
      },
    });

    return sendSuccess(res, 'Resume PDF uploaded and published successfully', uploaded);
  } catch (err) {
    next(err);
  }
}
