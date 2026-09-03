import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../config/database.js';
import { sendError } from '../utils/response.js';

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', [], 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return sendError(res, 'Session expired or invalid token. Please log in again.', [], 401);
    }

    if (!decoded || !decoded.id) {
      return sendError(res, 'Invalid token payload.', [], 401);
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    if (!admin) {
      return sendError(res, 'Administrator account not found.', [], 401);
    }

    if (!admin.isActive) {
      return sendError(res, 'Administrator account is deactivated.', [], 403);
    }

    if (admin.role !== 'ADMIN') {
      return sendError(res, 'Forbidden: Administrative privileges required.', [], 403);
    }

    req.admin = admin;
    next();
  } catch (error) {
    return sendError(res, 'Authentication internal error', [error.message], 500);
  }
}
