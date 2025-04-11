'use client';
import React, { useState } from 'react';
import { AuthService, RegisterParams } from '../../lib/api/auth';

interface UserDetails {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  isVerified: boolean;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterParams>({
    username: '',
    email: '',
    password: '',
  });

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [errors, setErrors] = useState<Partial<RegisterParams> & { form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterParams> = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[_.])[a-zA-Z0-9_.]{5,30}$/.test(formData.username)) {
      newErrors.username = 'Username must be 5-30 chars with at least one uppercase, lowercase, and special character (._)';
    }
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const { confirmPassword, ...apiData } = formData;
      const response = await AuthService.register(apiData);
      
      // Set user details to show after successful registration
      setUserDetails({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        createdAt: new Date().toISOString(),
        isVerified: response.user.isVerified || false
      });
      
      console.log('Registration successful:', response);
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Registration failed. Please try again.'
      });
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

  if (userDetails) {
    return (
      <div className="flex w-full h-200 justify-center items-center text-black bg-blue-100">
        <div className="max-w-md w-100 mx-auto p-10 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Account Created Successfully!</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-lg mb-2">Your Account Details:</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Username:</span> {userDetails.username}</p>
                <p><span className="font-medium">Email:</span> {userDetails.email}</p>
                <p><span className="font-medium">Account Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    userDetails.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {userDetails.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </p>
                <p><span className="font-medium">Registered On:</span> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-lg mb-2">Next Steps:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check your email for verification instructions</li>
                <li>Complete your profile setup</li>
                <li>Explore your dashboard</li>
              </ul>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setUserDetails(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Back to Form
              </button>
              <a
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-200 justify-center items-center text-black bg-blue-100">
      <div className="max-w-md w-100 mx-auto p-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">My Account</h2>
        
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
              placeholder='Username'
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.username ? 'border-red-500' : 'border'
              }`}
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border'
              }`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border'
              }`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder='Confirm Password'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border'
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;