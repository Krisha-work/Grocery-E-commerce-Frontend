import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { UserService } from '../api/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('authToken');
      if (token) {
        try {
          const userData = await UserService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading
  };
}; 