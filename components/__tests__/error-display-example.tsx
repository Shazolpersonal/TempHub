'use client';

import { useState } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import { AppError, ErrorCode } from '@/types';
import { Button } from '@/components/ui/button';

/**
 * Example component demonstrating ErrorDisplay usage
 * This is for testing and documentation purposes
 */
export function ErrorDisplayExample() {
  const [error, setError] = useState<AppError | null>(null);

  const errorExamples: Array<{ label: string; error: AppError }> = [
    {
      label: 'File Too Large',
      error: {
        code: ErrorCode.FILE_TOO_LARGE,
        message: 'File exceeds maximum size',
        retryable: true,
      },
    },
    {
      label: 'Invalid File Type',
      error: {
        code: ErrorCode.INVALID_FILE_TYPE,
        message: 'Unsupported file format',
        retryable: true,
      },
    },
    {
      label: 'Rate Limit',
      error: {
        code: ErrorCode.RATE_LIMIT,
        message: 'Too many requests',
        retryable: true,
      },
    },
    {
      label: 'Network Error',
      error: {
        code: ErrorCode.NETWORK_ERROR,
        message: 'Connection failed',
        retryable: true,
      },
    },
    {
      label: 'Generation Failed',
      error: {
        code: ErrorCode.GENERATION_FAILED,
        message: 'AI generation error',
        retryable: true,
        details: 'Model timeout after 30 seconds',
      },
    },
    {
      label: 'Template Not Found (Non-retryable)',
      error: {
        code: ErrorCode.TEMPLATE_NOT_FOUND,
        message: 'Template does not exist',
        retryable: false,
      },
    },
  ];

  const handleRetry = () => {
    console.log('Retry clicked');
    setError(null);
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Error Display Component Examples</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Trigger Different Errors:</h2>
        <div className="flex flex-wrap gap-2">
          {errorExamples.map((example) => (
            <Button
              key={example.label}
              onClick={() => setError(example.error)}
              variant="outline"
              size="sm"
            >
              {example.label}
            </Button>
          ))}
          <Button onClick={() => setError(null)} variant="secondary" size="sm">
            Clear Error
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Current Error:</h2>
          <ErrorDisplay error={error} onRetry={handleRetry} />
        </div>
      )}

      {!error && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">
            Click a button above to see different error states
          </p>
        </div>
      )}
    </div>
  );
}
