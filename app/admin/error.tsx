'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import { ErrorCode } from '@/types';

/**
 * Admin Error Page
 * Catches errors in the admin section
 * Requirements: 7.1, 7.5
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin error caught:', error);
      console.error('Error digest:', error.digest);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorDisplay
          error={{
            code: ErrorCode.UNKNOWN_ERROR,
            message: error.message || 'An error occurred in the admin panel',
            retryable: true,
          }}
          onRetry={reset}
        />
      </div>
    </div>
  );
}
