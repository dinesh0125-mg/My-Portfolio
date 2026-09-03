import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';
import { skillsData } from '../../data/skills';
import { servicesData } from '../../data/services';
import { experienceData } from '../../data/experience';
import { educationData } from '../../data/education';
import { certificatesData } from '../../data/certificates';

const STORAGE_PREFIX = 'portfolio_admin_';

function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

export const adminStore = {
  // Hero & General Profile
  getHero() {
    return getStored('hero', {
      name: profileData.name,
      role: profileData.role,
      headline: profileData.headline,
      badge: profileData.hero.badge,
      supportingText: profileData.hero.supportingText,
      ctaWork: profileData.hero.ctaWork,
      ctaResume: profileData.hero.ctaResume,
      resumeUrl: profileData.resumeUrl,
      profileImage: '/images/hero-developer.jpg',
      location: profileData.location,
    });
  },
  saveHero(data) {
    setStored('hero', data);
  },

  // About Section
  getAbout() {
    return getStored('about', {
      heading: profileData.about.heading,
      intro: profileData.about.intro,
      summaryPoints: profileData.about.summaryPoints,
      highlights: profileData.about.highlights,
    });
  },
  saveAbout(data) {
    setStored('about', data);
  },

  // Projects
  getProjects() {
    return getStored('projects', projectsData);
  },
  saveProjects(projects) {
    setStored('projects', projects);
  },
  addProject(project) {
    const projects = this.getProjects();
    const newProject = {
      ...project,
      id: project.id || 'proj-' + Date.now(),
      status: project.status || 'Published',
    };
    projects.unshift(newProject);
    this.saveProjects(projects);
    return newProject;
  },
  updateProject(id, updatedData) {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], ...updatedData };
      this.saveProjects(projects);
      return projects[idx];
    }
    return null;
  },
  deleteProject(id) {
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.saveProjects(projects);
  },

  // Services
  getServices() {
    return getStored('services', servicesData.map((s, idx) => ({
      ...s,
      order: idx + 1,
      status: 'Active',
    })));
  },
  saveServices(services) {
    setStored('services', services);
  },
  addService(service) {
    const services = this.getServices();
    const newService = {
      ...service,
      id: service.id || 'service-' + Date.now(),
      order: services.length + 1,
      status: service.status || 'Active',
    };
    services.push(newService);
    this.saveServices(services);
    return newService;
  },
  updateService(id, updatedData) {
    const services = this.getServices();
    const idx = services.findIndex((s) => s.id === id);
    if (idx !== -1) {
      services[idx] = { ...services[idx], ...updatedData };
      this.saveServices(services);
      return services[idx];
    }
    return null;
  },
  deleteService(id) {
    const services = this.getServices().filter((s) => s.id !== id);
    this.saveServices(services);
  },

  // Experience
  getExperience() {
    return getStored('experience', experienceData);
  },
  saveExperience(exp) {
    setStored('experience', exp);
  },
  addExperience(item) {
    const list = this.getExperience();
    const newItem = {
      ...item,
      id: item.id || 'exp-' + Date.now(),
      status: item.status || 'Completed',
    };
    list.unshift(newItem);
    this.saveExperience(list);
    return newItem;
  },
  updateExperience(id, updatedData) {
    const list = this.getExperience();
    const idx = list.findIndex((e) => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedData };
      this.saveExperience(list);
      return list[idx];
    }
    return null;
  },
  deleteExperience(id) {
    const list = this.getExperience().filter((e) => e.id !== id);
    this.saveExperience(list);
  },

  // Skills
  getSkills() {
    return getStored('skills', skillsData.categories);
  },
  saveSkills(cats) {
    setStored('skills', cats);
  },
  addSkill(categoryId, skill) {
    const cats = this.getSkills();
    const cat = cats.find((c) => c.id === categoryId);
    if (cat) {
      cat.skills.push(skill);
      this.saveSkills(cats);
    }
  },
  deleteSkill(categoryId, skillName) {
    const cats = this.getSkills();
    const cat = cats.find((c) => c.id === categoryId);
    if (cat) {
      cat.skills = cat.skills.filter((s) => s.name !== skillName);
      this.saveSkills(cats);
    }
  },

  // Education
  getEducation() {
    return getStored('education', [educationData]);
  },
  saveEducation(edu) {
    setStored('education', edu);
  },
  addEducation(item) {
    const list = this.getEducation();
    const newItem = {
      ...item,
      id: item.id || 'edu-' + Date.now(),
    };
    list.push(newItem);
    this.saveEducation(list);
    return newItem;
  },
  updateEducation(id, updatedData) {
    const list = this.getEducation();
    const idx = list.findIndex((e) => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedData };
      this.saveEducation(list);
      return list[idx];
    }
    return null;
  },
  deleteEducation(id) {
    const list = this.getEducation().filter((e) => e.id !== id);
    this.saveEducation(list);
  },

  // Certificates
  getCertificates() {
    return getStored('certificates', certificatesData);
  },
  saveCertificates(certs) {
    setStored('certificates', certs);
  },
  addCertificate(item) {
    const list = this.getCertificates();
    const newItem = {
      ...item,
      id: item.id || 'cert-' + Date.now(),
    };
    list.push(newItem);
    this.saveCertificates(list);
    return newItem;
  },
  updateCertificate(id, updatedData) {
    const list = this.getCertificates();
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedData };
      this.saveCertificates(list);
      return list[idx];
    }
    return null;
  },
  deleteCertificate(id) {
    const list = this.getCertificates().filter((c) => c.id !== id);
    this.saveCertificates(list);
  },

  // Contact
  getContact() {
    return getStored('contact', {
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      linkedin: profileData.linkedin,
      github: profileData.github,
      twitter: 'https://twitter.com',
      discord: 'dineshm#0001',
    });
  },
  saveContact(data) {
    setStored('contact', data);
  },

  // Settings
  getSettings() {
    return getStored('settings', {
      siteTitle: 'Dinesh M | Full Stack Developer',
      metaDescription: 'Portfolio of Dinesh M - Full Stack Developer specializing in Java, Spring Boot, React, and MySQL.',
      resumeFileName: 'Dinesh_M_Resume.pdf',
      adminTheme: 'light',
      accentColor: 'teal',
      enableDemoMode: true,
      lastUpdated: new Date().toISOString(),
    });
  },
  saveSettings(data) {
    setStored('settings', { ...data, lastUpdated: new Date().toISOString() });
  },

  // Activity Log
  getActivityLog() {
    return getStored('activity_log', [
      { id: 1, action: 'Portfolio initialized', time: 'Just now', type: 'system' },
      { id: 2, action: 'Updated Project details', time: '2 hours ago', type: 'project' },
      { id: 3, action: 'Verified Infosys Certificates', time: '1 day ago', type: 'certificate' },
    ]);
  },
  logActivity(action, type = 'update') {
    const log = this.getActivityLog();
    log.unshift({
      id: Date.now(),
      action,
      time: 'Just now',
      type,
    });
    setStored('activity_log', log.slice(0, 20));
  },
};
