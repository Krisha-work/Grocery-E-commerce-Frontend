'use client';

import { toastService } from '../servicers/toastService';

type ApiFunction<T> = (...args: any[]) => Promise<T>;

export function withToast<T>(
  apiFunction: ApiFunction<T>,
  {
    loadingMessage = 'Processing...',
    successMessage = 'Operation successful',
    errorMessage = 'Operation failed',
  }: {
    loadingMessage?: string;
    successMessage?: string | ((data: T) => string);
    errorMessage?: string | ((error: any) => string);
  } = {}
) {
  return async (...args: Parameters<ApiFunction<T>>): Promise<T> => {
    return toastService.promise(
      apiFunction(...args),
      {
        loading: loadingMessage,
        success: successMessage,
        error: errorMessage,
      }
    );
  };
} 