import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests and attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ethio_rewards_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid or expired
      localStorage.removeItem('ethio_rewards_token');
      localStorage.removeItem('ethio_rewards_user');
    }
    return Promise.reject(error);
  }
);

export default api;
