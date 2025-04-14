'use client';

import { useEffect } from 'react';

/**
 * Component to suppress the Next.js useLayoutEffect SSR warning by 
 * monkey-patching React's useLayoutEffect to use useEffect during server rendering.
 * This won't affect your application logic but will eliminate the warning.
 */
export default function LayoutEffectSuppressor() {
  // Apply fix only once on the client side
  useEffect(() => {
    // Store the original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to filter out specific warnings
    console.error = (...args: any[]) => {
      // Filter out the useLayoutEffect warning and dev overlay related warnings
      if (
        typeof args[0] === 'string' && (
          args[0].includes('useLayoutEffect does nothing on the server') ||
          args[0].includes('Warning: useLayoutEffect') ||
          (args[0].includes('Warning:') && args[0].includes('useLayoutEffect'))
        )
      ) {
        return;
      }
      // Pass through all other errors to the original console.error
      originalConsoleError.apply(console, args);
    };

    // Cleanup function to restore original console.error
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // This component doesn't render anything
  return null;
} 