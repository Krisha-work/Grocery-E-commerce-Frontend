// services/authService.ts
import apiClient from "./apiHelper";

// Define API endpoints
const API_ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  USER_DATA: "/users/me",
  UPDATE_USER: "/users/profile",
  LOGOUT: "/users/logout",
};

// Define TypeScript interfaces for request/response
interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

interface LoginParams {
  usernameOrEmail: string;
  password: string;
  rememberMe:boolean;
}

interface UpdateUserParams {
  username?: string;
  email?: string;
}

// Auth service methods
export const AuthService = {
  register: async (data: RegisterParams): Promise<AuthResponse> => {
    return apiClient.post(API_ENDPOINTS.REGISTER, data);
  },

  login: async (data: LoginParams): Promise<AuthResponse> => {
    return apiClient.post(API_ENDPOINTS.LOGIN, data);
  },

  getUser: async (): Promise<User> => {
    return apiClient.get(API_ENDPOINTS.USER_DATA);
  },

  updateUser: async (userId: string, data: UpdateUserParams): Promise<User> => {
    return apiClient.put(`${API_ENDPOINTS.UPDATE_USER}/${userId}`, data);
  },

  logout: async (): Promise<void> => {
    return apiClient.post(API_ENDPOINTS.LOGOUT);
  },
};

// Export type definitions for use in components
export type { User, AuthResponse, RegisterParams, LoginParams, UpdateUserParams };