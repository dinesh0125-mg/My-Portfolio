import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, getProfile, changePassword } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { loginSchema, changePasswordSchema } from '../validators/authValidator.js';

const router = Router();

// Rate limiting on login to protect against brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validateBody(loginSchema), login);
router.get('/profile', requireAdmin, getProfile);
router.put('/change-password', requireAdmin, validateBody(changePasswordSchema), changePassword);

export default router;
