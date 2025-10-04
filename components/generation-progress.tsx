'use client';

import { Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppError } from '@/types';

export type GenerationStatus = 'idle' | 'uploading' | 'generating' | 'complete' | 'error';

interface GenerationProgressProps {
  status: GenerationStatus;
  progress?: number;
  error?: AppError;
  generatedImage?: string;
  onRetry?: () => void;
  onDownload?: () => void;
}

export function GenerationProgress({
  status,
  progress,
  error,
  generatedImage,
  onRetry,
  onDownload,
}: GenerationProgressProps) {
  // Idle state - nothing to show
  if (status === 'idle') {
    return null;
  }

  // Error state
  if (status === 'error' && error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Generation Failed
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {getErrorMessage(error)}
            </p>
            {error.retryable && onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'complete' && generatedImage) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border-b border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Generation Complete!</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage}
                alt="Generated image"
                className="w-full h-full object-contain"
              />
            </div>
            
            {onDownload && (
              <Button onClick={onDownload} className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Image
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading states (uploading or generating)
  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-card border rounded-lg">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">
            {status === 'uploading' ? 'Uploading Image...' : 'Generating Your Image...'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {status === 'uploading' 
              ? 'Please wait while we process your image'
              : 'This may take a few moments. Please don\'t close this page.'}
          </p>
        </div>

        {progress !== undefined && progress > 0 && (
          <div className="w-full max-w-md">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {progress}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getErrorMessage(error: AppError): string {
  switch (error.code) {
    case 'FILE_TOO_LARGE':
      return 'The image file is too large. Maximum size is 5MB.';
    case 'INVALID_FILE_TYPE':
      return 'Invalid file type. Please upload a valid image (JPG, PNG, WEBP).';
    case 'UPLOAD_FAILED':
      return 'Failed to upload the image. Please try again.';
    case 'GENERATION_FAILED':
      return 'Failed to generate the image. Please try again.';
    case 'RATE_LIMIT':
      return 'Too many requests. Please wait a few minutes and try again.';
    case 'NETWORK_ERROR':
      return 'Network connection issue. Please check your internet and try again.';
    case 'TEMPLATE_NOT_FOUND':
      return 'Template not found. Please select a different template.';
    case 'API_ERROR':
      return 'An error occurred with the AI service. Please try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}
