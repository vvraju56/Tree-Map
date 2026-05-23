import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const stored = JSON.parse(localStorage.getItem('tree-map-auth') || localStorage.getItem('kinmap-auth') || '{}');
    const token = stored?.state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tree-map-auth');
      localStorage.removeItem('kinmap-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
