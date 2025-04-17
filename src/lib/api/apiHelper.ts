// utils/apiHelper.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001/api';

// Create Axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // validateStatus: () => true
});

// Add request interceptor to handle auth tokens and content type
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or wherever you store it
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set Content-Type if not FormData (for file uploads)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // Format error response consistently
    const errorResponse = {
      message: '',
      errors: {},
      status: error.response?.status || 500
    };

    if (error.response) {
      // Server responded with error
      errorResponse.message = error.response.data?.message || error.response.statusText || 'Operation failed';
      errorResponse.errors = error.response.data?.errors || {};
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Redirect to login only if not already on login/register pages
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
      }
    } else if (error.request) {
      // Request made but no response
      errorResponse.message = 'No response received from server. Please check your connection.';
    } else {
      // Error in request configuration
      errorResponse.message = error.message || 'An unexpected error occurred';
    }

    // Attach the formatted error response to the error object
    error.response = { data: errorResponse };
    return Promise.reject(error);
  }
);

export const checkAPIHealth = async (endpoint: string = '/health'): Promise<boolean> => {
  try {
    await axiosInstance.get(endpoint);
    return true;
  } catch (error) {
    return false;
  }
};

// Export the configured instance
export default axiosInstance;