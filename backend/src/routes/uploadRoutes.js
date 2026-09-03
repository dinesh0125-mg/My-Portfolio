import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { uploadImage, uploadResume } from '../middleware/uploadMiddleware.js';
import {
  uploadProfile,
  uploadProject,
  uploadCertificate,
  uploadResumeFile,
} from '../controllers/uploadController.js';

const router = Router();

// All upload routes strictly require valid admin authentication
router.use(requireAdmin);

router.post('/profile', uploadImage.single('file'), uploadProfile);
router.post('/project', uploadImage.single('file'), uploadProject);
router.post('/certificate', uploadImage.single('file'), uploadCertificate);
router.post('/resume', uploadResume.single('file'), uploadResumeFile);

export default router;
