import { apiClient } from './axios';

export const adminService = {
  // Dashboard & Metrics
  async getDashboardStats() {
    const res = await apiClient.get('/admin/dashboard/stats');
    return res.data?.data;
  },

  // Hero Section
  async getHero() {
    const res = await apiClient.get('/admin/hero');
    return res.data?.data?.hero;
  },
  async updateHero(data) {
    const res = await apiClient.put('/admin/hero', data);
    return res.data?.data?.hero;
  },

  // About Section
  async getAbout() {
    const res = await apiClient.get('/admin/about');
    return res.data?.data?.about;
  },
  async updateAbout(data) {
    const res = await apiClient.put('/admin/about', data);
    return res.data?.data?.about;
  },

  // Projects CRUD
  async getProjects() {
    const res = await apiClient.get('/admin/projects');
    return res.data?.data?.projects;
  },
  async getProject(id) {
    const res = await apiClient.get(`/admin/projects/${id}`);
    return res.data?.data?.project;
  },
  async createProject(data) {
    const res = await apiClient.post('/admin/projects', data);
    return res.data?.data?.project;
  },
  async updateProject(id, data) {
    const res = await apiClient.put(`/admin/projects/${id}`, data);
    return res.data?.data?.project;
  },
  async deleteProject(id) {
    const res = await apiClient.delete(`/admin/projects/${id}`);
    return res.data;
  },

  // Services CRUD
  async getServices() {
    const res = await apiClient.get('/admin/services');
    return res.data?.data?.services;
  },
  async createService(data) {
    const res = await apiClient.post('/admin/services', data);
    return res.data?.data?.service;
  },
  async updateService(id, data) {
    const res = await apiClient.put(`/admin/services/${id}`, data);
    return res.data?.data?.service;
  },
  async deleteService(id) {
    const res = await apiClient.delete(`/admin/services/${id}`);
    return res.data;
  },

  // Skills CRUD
  async getSkills() {
    const res = await apiClient.get('/admin/skills');
    return res.data?.data?.skills;
  },
  async createSkill(data) {
    const res = await apiClient.post('/admin/skills', data);
    return res.data?.data?.skill;
  },
  async updateSkill(id, data) {
    const res = await apiClient.put(`/admin/skills/${id}`, data);
    return res.data?.data?.skill;
  },
  async deleteSkill(id) {
    const res = await apiClient.delete(`/admin/skills/${id}`);
    return res.data;
  },

  // Experience CRUD
  async getExperience() {
    const res = await apiClient.get('/admin/experience');
    return res.data?.data?.experience;
  },
  async createExperience(data) {
    const res = await apiClient.post('/admin/experience', data);
    return res.data?.data?.experience;
  },
  async updateExperience(id, data) {
    const res = await apiClient.put(`/admin/experience/${id}`, data);
    return res.data?.data?.experience;
  },
  async deleteExperience(id) {
    const res = await apiClient.delete(`/admin/experience/${id}`);
    return res.data;
  },

  // Education CRUD
  async getEducation() {
    const res = await apiClient.get('/admin/education');
    return res.data?.data?.education;
  },
  async createEducation(data) {
    const res = await apiClient.post('/admin/education', data);
    return res.data?.data?.education;
  },
  async updateEducation(id, data) {
    const res = await apiClient.put(`/admin/education/${id}`, data);
    return res.data?.data?.education;
  },
  async deleteEducation(id) {
    const res = await apiClient.delete(`/admin/education/${id}`);
    return res.data;
  },

  // Certificates CRUD
  async getCertificates() {
    const res = await apiClient.get('/admin/certificates');
    return res.data?.data?.certificates;
  },
  async createCertificate(data) {
    const res = await apiClient.post('/admin/certificates', data);
    return res.data?.data?.certificate;
  },
  async updateCertificate(id, data) {
    const res = await apiClient.put(`/admin/certificates/${id}`, data);
    return res.data?.data?.certificate;
  },
  async deleteCertificate(id) {
    const res = await apiClient.delete(`/admin/certificates/${id}`);
    return res.data;
  },

  // Contact Info
  async getContactInfo() {
    const res = await apiClient.get('/admin/contact-info');
    return res.data?.data?.contact;
  },
  async updateContactInfo(data) {
    const res = await apiClient.put('/admin/contact-info', data);
    return res.data?.data?.contact;
  },

  // Contact Messages
  async getContactMessages() {
    const res = await apiClient.get('/admin/contact-messages');
    return res.data?.data?.messages;
  },
  async updateMessageStatus(id, status) {
    const res = await apiClient.put(`/admin/contact-messages/${id}`, { status });
    return res.data?.data?.message;
  },
  async deleteMessage(id) {
    const res = await apiClient.delete(`/admin/contact-messages/${id}`);
    return res.data;
  },

  // Settings
  async getSettings() {
    const res = await apiClient.get('/admin/settings');
    return res.data?.data?.settings;
  },
  async updateSettings(data) {
    const res = await apiClient.put('/admin/settings', data);
    return res.data?.data?.settings;
  },
};
