'use client';
import React, { useState, useEffect } from 'react';
import {
  verifyEmail,
  fetchProfile,
  updateProfile,
  verifyProfileUpdate,
  resetPassword,
  handleLogout,
  forgotPassword
} from '../../lib/servicers/userService';
import { User } from '../../lib/api/auth';
import Cookies from 'js-cookie';
import { AddToCartButton } from '@/components/AddToCartButton';

interface UserProfile extends User {
  isVerified: boolean;
  createdAt: string;
}

interface UpdateProfileData {
  username: string;
  email: string;
}

interface ResetPasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const [updateData, setUpdateData] = useState<UpdateProfileData>({
    username: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState<ResetPasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [emailForReset, setEmailForReset] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const userProfile = await fetchProfile();
      if (userProfile) {
        setProfile({
          ...userProfile,
          isVerified: true, // This should come from the API
          createdAt: new Date().toISOString() // This should come from the API
        });
        setUpdateData({
          username: userProfile.name,
          email: userProfile.email,
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await updateProfile(updateData);
      setSuccess('Profile updated successfully');
      await loadProfile();
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await resetPassword();
      setSuccess('Password reset successful');
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await forgotPassword({ email: emailForReset });
      setSuccess('Password reset email sent');
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutUser = async () => {
    try {
      await handleLogout();
      Cookies.remove('authToken');
      localStorage.clear();
      window.location.href = '/auth/login';
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (isLoading && !profile) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-black bg-gray-100 py-8 flex justify-center items-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white w-170 rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Account Settings</h1>
            <button
              onClick={handleLogoutUser}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'security' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 ">
                <div className="flex justify-center items-center gap-4">

                  <div>
                    <input
                      type="text"
                      placeholder="Username"
                      value={updateData.username}
                      onChange={(e) => setUpdateData({ ...updateData, username: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={updateData.email}
                      onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-lg focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-130 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 flex justify-center items-center gap-6">
              <div className='w-170'>
                <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </div>

              <div className='w-170'>
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={emailForReset}
                      onChange={(e) => setEmailForReset(e.target.value)}
                      className="mt-1 block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;