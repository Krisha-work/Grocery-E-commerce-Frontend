'use client';

import axios from 'axios';
import { toastService } from '../servicers/toastService';

// Extend AxiosRequestConfig to include showSuccessToast
declare module 'axios' {
  export interface AxiosRequestConfig {
    showSuccessToast?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add any request preprocessing here
    return config;
  },
  (error) => {
    toastService.error('Request failed to send');
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle success responses
    const { status, config, data } = response;
    
    // Don't show success toast for GET requests unless they explicitly set showSuccessToast
    if (config.method !== 'get' || config.showSuccessToast) {
      const successMessage = data?.message || 'Operation successful';
      toastService.success(successMessage);
    }
    
    return response;
  },
  (error) => {
    // Handle error responses
    const { response, message } = error;
    
    if (response) {
      // Server responded with a status code outside of 2xx
      const errorMessage = response.data?.message || response.statusText || 'Operation failed';
      toastService.error(`Error ${response.status}: ${errorMessage}`);
    } else if (error.request) {
      // Request was made but no response received
      toastService.error('No response received from server');
    } else {
      // Something else happened while setting up the request
      toastService.error(message || 'An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 