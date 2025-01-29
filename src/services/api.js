import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 errors
      if (error.response.status === 401) {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show error message
        message.error('Session expired. Please login again.');
        
        // Redirect to login page
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      
      // Handle other errors
      const errorMessage = error.response.data?.message || 'An error occurred';
      message.error(errorMessage);
    } else if (error.request) {
      message.error('Network error. Please check your connection.');
    } else {
      message.error('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
