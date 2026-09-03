import { apiClient } from './axios';

export const authService = {
  async login(email, password, rememberMe = false) {
    try {
      const response = await apiClient.post('/admin/auth/login', { email, password });
      const { data } = response.data;

      if (data && data.token) {
        if (rememberMe) {
          localStorage.setItem('portfolio_jwt_token', data.token);
          localStorage.setItem('portfolio_admin_user', JSON.stringify(data.admin));
        } else {
          sessionStorage.setItem('portfolio_jwt_token', data.token);
          sessionStorage.setItem('portfolio_admin_user', JSON.stringify(data.admin));
        }
      }

      return { success: true, data };
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed. Please check your credentials.';
      return { success: false, error: msg };
    }
  },

  logout() {
    localStorage.removeItem('portfolio_jwt_token');
    localStorage.removeItem('portfolio_admin_user');
    sessionStorage.removeItem('portfolio_jwt_token');
    sessionStorage.removeItem('portfolio_admin_user');
  },

  async getProfile() {
    const response = await apiClient.get('/admin/auth/profile');
    return response.data.data?.admin;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await apiClient.put('/admin/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getToken() {
    return localStorage.getItem('portfolio_jwt_token') || sessionStorage.getItem('portfolio_jwt_token');
  },

  getCurrentUser() {
    const raw = localStorage.getItem('portfolio_admin_user') || sessionStorage.getItem('portfolio_admin_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
