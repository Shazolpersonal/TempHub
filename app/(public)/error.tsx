'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import { ErrorCode } from '@/types';

/**
 * Public Pages Error Handler
 * Catches errors in the public section
 * Requirements: 7.1, 7.5
 */
export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Public page error caught:', error);
      console.error('Error digest:', error.digest);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <ErrorDisplay
          error={{
            code: ErrorCode.UNKNOWN_ERROR,
            message: error.message || 'An unexpected error occurred',
            retryable: true,
          }}
          onRetry={reset}
        />
      </div>
    </div>
  );
}
