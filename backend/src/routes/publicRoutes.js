import { Router } from 'express';
import { getPublicPortfolio } from '../controllers/portfolioController.js';
import { getHero } from '../controllers/heroController.js';
import { getAbout } from '../controllers/aboutController.js';
import { getProjects, getProjectById } from '../controllers/projectController.js';
import { getServices } from '../controllers/serviceController.js';
import { getSkills } from '../controllers/skillController.js';
import { getExperience } from '../controllers/experienceController.js';
import { getEducation } from '../controllers/educationController.js';
import { getCertificates } from '../controllers/certificateController.js';
import { getProcess } from '../controllers/processController.js';
import { getPricing } from '../controllers/pricingController.js';
import { getContactInfo, submitContactMessage } from '../controllers/contactController.js';
import { getSettings } from '../controllers/settingsController.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { contactMessageSchema } from '../validators/contactValidator.js';

const router = Router();

// Full portfolio data for single roundtrip fetch
router.get('/portfolio', getPublicPortfolio);

// Granular section endpoints
router.get('/hero', getHero);
router.get('/about', getAbout);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.get('/services', getServices);
router.get('/skills', getSkills);
router.get('/experience', getExperience);
router.get('/education', getEducation);
router.get('/certificates', getCertificates);
router.get('/process', getProcess);
router.get('/pricing', getPricing);
router.get('/contact-info', getContactInfo);
router.get('/settings', getSettings);

// Public contact inquiry submission
router.post('/contact', validateBody(contactMessageSchema), submitContactMessage);

export default router;
