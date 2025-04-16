'use client';

import { toast, Toast } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
};

export const toastService = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Error occurred',
    }: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((err: any) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading,
        success,
        error,
      },
      { ...defaultOptions, ...options }
    );
  },

  // Helper method to handle API responses
  handleResponse: (response: Response, successMessage?: string) => {
    const status = response.status;
    const isSuccess = status >= 200 && status < 300;
    
    if (isSuccess) {
      toastService.success(successMessage || 'Operation successful');
    } else {
      toastService.error(`Error: ${status} - ${response.statusText}`);
    }
    
    return isSuccess;
  },

  // Helper method to handle API errors
  handleError: (error: any, customMessage?: string) => {
    const errorMessage = customMessage || error?.message || 'An unexpected error occurred';
    toastService.error(errorMessage);
    return false;
  },
}; 