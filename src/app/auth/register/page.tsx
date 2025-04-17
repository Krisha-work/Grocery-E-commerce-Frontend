'use client';
// components/RegisterForm.tsx
import React, { useEffect, useState } from 'react';
import { handleRegister } from '../../../lib/servicers/userService';
import { RegisterParams } from '@/src/lib/api/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toastService } from '../../../lib/servicers/toastService';

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterParams>({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterParams> & { form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const isAuthenticated = () => {
    const token = Cookies.get('authToken');
    return !!token;
  };

  useEffect(()=>{
    if (isAuthenticated()) {
      router.push('/');
      
      return;
    }
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterParams> = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[_.])[a-zA-Z0-9_.]+$/.test(formData.username)) newErrors.username = 'Letters, numbers, dots, and underscores';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must contain at least 8 characters, including one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const response = await handleRegister(formData);
      
      if (response?.token) {
        // Store token securely
        localStorage.setItem('token', response.token);
        
        // Show success message
        toastService.success(response.message);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      // Handle specific validation errors from the backend
      if (err.response?.data?.errors) {

        const backendErrors = err.response.data.errors;
        const formattedErrors: Record<string, string> = {};
        
        // Map backend validation errors to form fields
        Object.entries(backendErrors).forEach(([key, value]) => {
          formattedErrors[key] = Array.isArray(value) ? value[0] : value as string;
        });
        
        setErrors(formattedErrors);
      } else {
        // Set generic error message
        setErrors({
          form: err instanceof Error ? err.message : 'Registration failed. Please try again.'
        });
      }
      
      // Show error toast
      toastService.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex w-full h-screen justify-center items-center text-black">
      <div className="max-w-md w-full mx-auto p-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border'}`}
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border'}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border'}`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;