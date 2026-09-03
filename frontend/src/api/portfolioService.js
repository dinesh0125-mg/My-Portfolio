import { apiClient } from './axios';
import { profileData } from '../data/profile';
import { projectsData } from '../data/projects';
import { skillsData } from '../data/skills';
import { experienceData } from '../data/experience';
import { educationData } from '../data/education';
import { certificatesData } from '../data/certificates';
import { servicesData } from '../data/services';

export const portfolioService = {
  async getPortfolio() {
    try {
      const response = await apiClient.get('/portfolio');
      return response.data?.data;
    } catch (err) {
      console.warn('Portfolio API unreachable, falling back to local dataset:', err.message);
      return {
        hero: profileData,
        about: profileData.about,
        services: servicesData,
        projects: projectsData,
        skills: skillsData.categories,
        experience: experienceData,
        education: [educationData],
        certificates: certificatesData,
        contact: profileData,
        settings: {
          siteTitle: 'Dinesh M | Full Stack Developer',
          metaDescription: profileData.headline,
          resumeUrl: profileData.resumeUrl,
        },
      };
    }
  },

  async getProjects() {
    try {
      const response = await apiClient.get('/projects');
      return response.data?.data?.projects;
    } catch {
      return projectsData;
    }
  },
};
