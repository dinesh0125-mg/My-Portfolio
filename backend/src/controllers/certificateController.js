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
    const cert = await prisma.certificate.create({ data: req.body });
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

    const cert = await prisma.certificate.update({ where: { id }, data: req.body });

    if (req.body.certificateImagePublicId && existing.certificateImagePublicId && existing.certificateImagePublicId !== req.body.certificateImagePublicId) {
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
