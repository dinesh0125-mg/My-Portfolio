import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { projectSchema } from '../validators/projectValidator.js';

import { getDashboardStats } from '../controllers/dashboardController.js';
import { getHero, updateHero } from '../controllers/heroController.js';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import {
  getProcess,
  createProcess,
  updateProcess,
  deleteProcess,
} from '../controllers/processController.js';
import {
  getPricing,
  createPricing,
  updatePricing,
  deletePricing,
} from '../controllers/pricingController.js';
import {
  getContactInfo,
  updateContactInfo,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();

// Enforce admin authentication across all admin routes
router.use(requireAdmin);

// Dashboard Statistics & Activity Log
router.get('/dashboard/stats', getDashboardStats);

// Hero
router.get('/hero', getHero);
router.put('/hero', updateHero);

// About
router.get('/about', getAbout);
router.put('/about', updateAbout);

// Projects
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', validateBody(projectSchema), createProject);
router.put('/projects/:id', validateBody(projectSchema), updateProject);
router.delete('/projects/:id', deleteProject);

// Services
router.get('/services', getServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Skills
router.get('/skills', getSkills);
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// Experience
router.get('/experience', getExperience);
router.post('/experience', createExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.get('/education', getEducation);
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Certificates
router.get('/certificates', getCertificates);
router.post('/certificates', createCertificate);
router.put('/certificates/:id', updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

// Process
router.get('/process', getProcess);
router.post('/process', createProcess);
router.put('/process/:id', updateProcess);
router.delete('/process/:id', deleteProcess);

// Pricing
router.get('/pricing', getPricing);
router.post('/pricing', createPricing);
router.put('/pricing/:id', updatePricing);
router.delete('/pricing/:id', deletePricing);

// Contact Info
router.get('/contact-info', getContactInfo);
router.put('/contact-info', updateContactInfo);

// Contact Messages
router.get('/contact-messages', getContactMessages);
router.put('/contact-messages/:id', updateContactMessageStatus);
router.delete('/contact-messages/:id', deleteContactMessage);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
