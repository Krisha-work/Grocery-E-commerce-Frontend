import { UserService } from "../api/auth";

// Register a new user
const handleRegister = async (registerData: { email: string; password: string; username: string }) => {
    try {
        const response = await UserService.register(registerData);
        return response;
    } catch (error: any) {
        // Extract meaningful error message from the error response
        const errorMessage = error.response?.data?.message 
            || error.response?.data?.error 
            || error.message 
            || 'Registration failed. Please try again.';
            
        // Throw a new error with the meaningful message
        throw new Error(errorMessage);
    }
};

// User login
const handleLogin = async (loginData: { usernameOrEmail: string; password: string; rememberMe: boolean }) => {
    try {
        const { user, token } = await UserService.login(loginData);
        localStorage.setItem('token', token);
        console.log('Login successful:', user);
        return { user, token };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Verify email
const verifyEmail = async (token: string) => {
    try {
        await UserService.verifyEmail(token);
        console.log('Email verified successfully');
    } catch (error) {
        console.error('Email verification failed:', error);
    }
};

// Forgot password
const forgotPassword = async (data: { email: string }) => {
    try {
        await UserService.forgotPassword(data);
        console.log('Password reset email sent');

    } catch (error) {
        console.error('Password reset email error:', error);
    }
};

// Get user profile
const fetchProfile = async () => {
    try {
        const profile = await UserService.getProfile();
        console.log('User profile:', profile);
        return profile;     
    } catch (error) {
        console.error('Profile fetch error:', error);
    }
};

// Logout
const handleLogout = async () => {
    try {
        await UserService.logout();
        localStorage.removeItem('token');
        console.log('Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// Update profile
const updateProfile = async (updateData: { username: string; email: string }) => {
    try {
        const updatedProfile = await UserService.updateProfile({
            username: updateData.username,
            email: updateData.email
        });
        console.log('Profile updated:', updatedProfile);
    } catch (error) {
        console.error('Profile update error:', error);
    }
};

// Verify profile update
const verifyProfileUpdate = async () => {
    try {
        await UserService.verifyProfileUpdate();
        console.log('Profile update verified');
    } catch (error) {
        console.error('Profile update verification failed:', error);
    }
};

// Reset password
const resetPassword = async (data: { currentPassword : string, newPassword : string, confirmPassword : string}) => {
    try {
        await UserService.resetPassword({
            currentPassword:  data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword

        });
        
        console.log('Password reset successful');
    } catch (error) {
        console.error('Password reset error:', error);
    }
};

export { handleRegister, handleLogin, verifyEmail, fetchProfile, verifyProfileUpdate, updateProfile, resetPassword, handleLogout, forgotPassword };