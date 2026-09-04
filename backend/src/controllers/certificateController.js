import { prisma } from '../config/database.js';
import { cloudinaryService } from '../services/cloudinaryService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getCertificates(req, res, next) {
  try {
    const certificates = await prisma.certificate.findMany({ orderBy: { displayOrder: 'asc' } });
    return sendSuccess(res, 'Certificates retrieved', { certificates });
  } catch (err) {
    next(err);
  }
}

export async function createCertificate(req, res, next) {
  try {
    const {
      title,
      organization,
      year,
      description,
      certificateImageUrl,
      certificateImagePublicId,
      certificateUrl,
      credentialId,
      skills,
      displayOrder,
      isActive,
    } = req.body;

    const cert = await prisma.certificate.create({
      data: {
        title,
        organization,
        year: String(year || '2026'),
        description: description || null,
        certificateImageUrl: certificateImageUrl || null,
        certificateImagePublicId: certificateImagePublicId || null,
        certificateUrl: certificateUrl || null,
        credentialId: credentialId || null,
        skills: skills || [],
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
    return sendSuccess(res, 'Certificate created', { certificate: cert }, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCertificate(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) return sendError(res, 'Certificate not found', [], 404);

    const {
      title,
      organization,
      year,
      description,
      certificateImageUrl,
      certificateImagePublicId,
      certificateUrl,
      credentialId,
      skills,
      displayOrder,
      isActive,
    } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (organization !== undefined) dataToUpdate.organization = organization;
    if (year !== undefined) dataToUpdate.year = String(year);
    if (description !== undefined) dataToUpdate.description = description;
    if (certificateImageUrl !== undefined) dataToUpdate.certificateImageUrl = certificateImageUrl || null;
    if (certificateImagePublicId !== undefined) dataToUpdate.certificateImagePublicId = certificateImagePublicId || null;
    if (certificateUrl !== undefined) dataToUpdate.certificateUrl = certificateUrl;
    if (credentialId !== undefined) dataToUpdate.credentialId = credentialId;
    if (skills !== undefined) dataToUpdate.skills = skills;
    if (displayOrder !== undefined) dataToUpdate.displayOrder = Number(displayOrder);
    if (isActive !== undefined) dataToUpdate.isActive = Boolean(isActive);

    const cert = await prisma.certificate.update({
      where: { id },
      data: dataToUpdate,
    });

    if (
      certificateImagePublicId &&
      existing.certificateImagePublicId &&
      existing.certificateImagePublicId !== certificateImagePublicId
    ) {
      cloudinaryService.deleteAsset(existing.certificateImagePublicId).catch(() => {});
    }

    return sendSuccess(res, 'Certificate updated', { certificate: cert });
  } catch (err) {
    next(err);
  }
}

export async function deleteCertificate(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) return sendError(res, 'Certificate not found', [], 404);

    await prisma.certificate.delete({ where: { id } });

    if (existing.certificateImagePublicId) {
      await cloudinaryService.deleteAsset(existing.certificateImagePublicId);
    }

    return sendSuccess(res, 'Certificate deleted');
  } catch (err) {
    next(err);
  }
}
