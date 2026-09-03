import { apiClient } from './axios';

export const uploadService = {
  async uploadProfileImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/admin/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data;
  },

  async uploadProjectImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/admin/upload/project', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data;
  },

  async uploadCertificateImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/admin/upload/certificate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data;
  },

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/admin/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data;
  },
};
