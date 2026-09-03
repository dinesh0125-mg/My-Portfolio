import { authService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', [], 400);
    }

    const result = await authService.login(email, password);
    if (!result.success) {
      return sendError(res, result.message, [], result.statusCode || 401);
    }

    return sendSuccess(res, 'Admin authentication successful', result.data);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    const admin = await authService.getProfile(req.admin.id);
    return sendSuccess(res, 'Admin profile retrieved', { admin });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.admin.id, currentPassword, newPassword);
    if (!result.success) {
      return sendError(res, result.message, [], result.statusCode || 400);
    }
    return sendSuccess(res, result.message);
  } catch (err) {
    next(err);
  }
}
