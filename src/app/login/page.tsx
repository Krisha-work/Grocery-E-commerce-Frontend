'use client';
// components/LoginForm.tsx
import React, { useEffect, useState } from 'react';
import { UserService, LoginParams } from '../../lib/api/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toastService } from '../../lib/servicers/toastService';

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginParams>({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Partial<LoginParams> & { form?: string }>({});
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
    const newErrors: Partial<LoginParams> = {};
    
    if (!formData.usernameOrEmail.trim()) newErrors.usernameOrEmail = 'Username or Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData);
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const response = await UserService.login(formData);
      
      console.log(response);
      
      if (response.data.token) {
        Cookies.set('authToken', response.data.token, { expires: 1 }); // Expires in 1 days
        localStorage.setItem('token', response.data.token);
        
        // Show success toast
        toastService.success(response.message);
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err:any) {
      console.log(err.response);
      
      const errorMessage = err instanceof Error ? err.response.data.message : 'Login failed. Please try again.';
      setErrors({ form: errorMessage });
      
      // Show error toast
      toastService.error(errorMessage);
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
    <div className="flex w-full h-200 justify-center items-center text-black">
      <div className="max-w-md w-100 mx-auto p-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              placeholder="Email or Username"
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.usernameOrEmail ? 'border-red-500' : 'border'}`}
            />
            {errors.usernameOrEmail && <p className="mt-1 text-sm text-red-600">{errors.usernameOrEmail}</p>}
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

          <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))} />
          <label htmlFor="rememberMe">Remember me</label>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;