import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL ||
  'https://my-portfolio-xcwj.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor to attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('portfolio_jwt_token') ||
      sessionStorage.getItem('portfolio_jwt_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthEndpoint =
        error.config?.url?.includes('/admin/auth/login');

      if (
        !isAuthEndpoint &&
        window.location.pathname.startsWith('/admin') &&
        window.location.pathname !== '/admin/login'
      ) {
        localStorage.removeItem('portfolio_jwt_token');
        localStorage.removeItem('portfolio_admin_user');

        sessionStorage.removeItem('portfolio_jwt_token');
        sessionStorage.removeItem('portfolio_admin_user');

        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
