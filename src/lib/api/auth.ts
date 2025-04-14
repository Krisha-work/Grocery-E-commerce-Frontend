// services/userService.ts
import apiClient from "./apiHelper";

interface User {
  id: string;
  name: string;
  email: string;
  // other user fields
}

interface RegisterParams {
  email: string;
  password: string;
  username: string;
}

interface LoginParams {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

interface UpdateProfileParams {
  username?: string;
  email?: string;
}

interface ResetPasswordParams {
  currentPassword: string;
  newPassword: string;
}

interface ForgotPasswordParams {
  email: string;
}

export const UserService = {
  register: async (data: RegisterParams): Promise<{ user: User; token: string }> => {
    return apiClient.post("/users/register", data);
  },

  login: async (data: LoginParams): Promise<{ user: User; token: string }> => {
    return apiClient.post("/users/login", data);
  },

  verifyEmail: async (token: string): Promise<void> => {
    return apiClient.get(`/users/verify-email/${token}`);
  },

  forgotPassword: async (data: ForgotPasswordParams): Promise<void> => {
    return apiClient.post("/users/forgot-password", data);
  },

  getProfile: async (): Promise<User> => {
    return apiClient.get("/users/profile");
  },

  logout: async (): Promise<void> => {
    return apiClient.post("/users/logout");
  },

  updateProfile: async (data: UpdateProfileParams): Promise<User> => {
    return apiClient.put("/users/profile", data);
  },

  verifyProfileUpdate: async (): Promise<void> => {
    return apiClient.post("/users/profile/verify");
  },

  resetPassword: async (data: ResetPasswordParams): Promise<void> => {
    return apiClient.put("/users/reset-password", data);
  },
};

export type { User, RegisterParams, LoginParams,  UpdateProfileParams, ResetPasswordParams };