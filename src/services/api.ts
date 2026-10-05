import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nutritrack_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired, clear and optionally redirect
      if (!window.location.pathname.startsWith('/login') && window.location.pathname !== '/') {
        localStorage.removeItem('nutritrack_token');
        localStorage.removeItem('nutritrack_user');
      }
    }
    return Promise.reject(error);
  }
);
