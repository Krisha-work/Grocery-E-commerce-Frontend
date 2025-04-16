import { useState, useCallback } from 'react';
import checkAPIHealth from '../lib/api/apiHelper';

export const useAPIError = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleError = useCallback((err: Error) => {
    setError(err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const isHealthy = await checkAPIHealth('/health');
      if (!isHealthy) {
        throw new Error('Unable to connect to the server. Please check if the server is running.');
      }
      clearError();
      return true;
    } catch (err) {
      handleError(err as Error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [clearError, handleError]);

  return {
    error,
    isChecking,
    handleError,
    clearError,
    checkConnection,
  };
}; 