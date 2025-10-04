import { AppError, ErrorCode } from '@/types';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onRetry, className = '' }: ErrorDisplayProps) {
  if (!error) return null;

  const getErrorMessage = (code: ErrorCode | string): { title: string; description: string } => {
    switch (code) {
      case ErrorCode.FILE_TOO_LARGE:
        return {
          title: 'File Too Large',
          description: 'Image file is too large. Maximum size is 5MB. Please choose a smaller image.',
        };
      case ErrorCode.INVALID_FILE_TYPE:
        return {
          title: 'Invalid File Type',
          description: 'Invalid file type. Please upload a valid image (JPG, PNG, WEBP, GIF, or HEIC).',
        };
      case ErrorCode.UPLOAD_FAILED:
        return {
          title: 'Upload Failed',
          description: 'Failed to upload your image. Please check your connection and try again.',
        };
      case ErrorCode.GENERATION_FAILED:
        return {
          title: 'Generation Failed',
          description: 'Failed to generate your image. The AI service encountered an error. Please try again.',
        };
      case ErrorCode.API_ERROR:
        return {
          title: 'API Error',
          description: 'An error occurred while communicating with the server. Please try again.',
        };
      case ErrorCode.RATE_LIMIT:
        return {
          title: 'Rate Limit Exceeded',
          description: 'Too many requests. Please wait a few minutes before trying again.',
        };
      case ErrorCode.NETWORK_ERROR:
        return {
          title: 'Network Error',
          description: 'Network connection issue. Please check your internet connection and try again.',
        };
      case ErrorCode.TEMPLATE_NOT_FOUND:
        return {
          title: 'Template Not Found',
          description: 'The requested template could not be found. It may have been deleted.',
        };
      case ErrorCode.VALIDATION_ERROR:
        return {
          title: 'Validation Error',
          description: error.message || 'The provided data is invalid. Please check your input and try again.',
        };
      default:
        return {
          title: 'Error',
          description: error.message || 'An unexpected error occurred. Please try again.',
        };
    }
  };

  const { title, description } = getErrorMessage(error.code);

  return (
    <Alert variant="destructive" className={`${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{description}</p>
        {error.details && (
          <p className="text-xs opacity-80 mb-3">
            Details: {typeof error.details === 'string' ? error.details : JSON.stringify(error.details)}
          </p>
        )}
        {error.retryable && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
