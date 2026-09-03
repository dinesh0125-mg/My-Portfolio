import { prisma } from '../config/database.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export const authService = {
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin) {
      return { success: false, statusCode: 401, message: 'Invalid email or password.' };
    }

    if (!admin.isActive) {
      return { success: false, statusCode: 403, message: 'Administrator account is deactivated.' };
    }

    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      return { success: false, statusCode: 401, message: 'Invalid email or password.' };
    }

    // Update lastLoginAt
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: 'ADMIN_LOGIN',
        entity: 'AUTH',
        details: `Successful login from ${cleanEmail}`,
      },
    });

    // Generate JWT token
    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLoginAt: new Date(),
        },
      },
    };
  },

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return { success: false, statusCode: 404, message: 'Administrator not found.' };
    }

    const isValid = await comparePassword(currentPassword, admin.passwordHash);
    if (!isValid) {
      return { success: false, statusCode: 400, message: 'Current password is incorrect.' };
    }

    const newHash = await hashPassword(newPassword);
    await prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash: newHash },
    });

    await prisma.adminActivity.create({
      data: {
        adminId,
        action: 'PASSWORD_CHANGED',
        entity: 'AUTH',
        details: 'Admin password successfully updated.',
      },
    });

    return { success: true, message: 'Password updated successfully.' };
  },

  async getProfile(adminId) {
    return prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  },
};
