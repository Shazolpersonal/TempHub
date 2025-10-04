'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { validateImageFile, formatFileSize, getMaxFileSizeMB, getSupportedFileTypesString } from '@/lib/validation';
import { AppError } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  disabled?: boolean;
}

export function ImageUploader({
  onUpload,
  maxSize = getMaxFileSizeMB(),
  acceptedFormats,
  disabled = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Handle file selection via input
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Process and validate file
  const handleFile = (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    
    if (!validation.isValid && validation.error) {
      setError(validation.error);
      setUploadedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedFile(file);

    // Call parent callback
    onUpload(file);
  };

  // Handle click to upload
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle remove image
  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      {!previewUrl && (
        <Card
          className={cn(
            'relative border-2 border-dashed transition-all duration-200 cursor-pointer',
            'touch-manipulation active:scale-[0.98]',
            isDragging && 'border-primary bg-primary/5 scale-[1.02]',
            !isDragging && 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
            <div className={cn(
              'p-3 md:p-4 rounded-full transition-colors',
              isDragging ? 'bg-primary/10' : 'bg-gray-100'
            )}>
              <Upload className={cn(
                'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10',
                isDragging ? 'text-primary' : 'text-gray-400'
              )} />
            </div>
            
            <div className="space-y-1 md:space-y-2">
              <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">
                {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                or tap to browse
              </p>
            </div>

            <div className="text-xs text-gray-400 space-y-0.5 md:space-y-1">
              <p className="hidden sm:block">Supported formats: JPG, PNG, WEBP, GIF, HEIC</p>
              <p className="sm:hidden">JPG, PNG, WEBP, GIF, HEIC</p>
              <p>Maximum file size: {maxSize}MB</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats?.join(',') || getSupportedFileTypesString()}
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled}
          />
        </Card>
      )}

      {/* Preview Area */}
      {previewUrl && uploadedFile && (
        <Card className="relative overflow-hidden">
          <div className="relative aspect-video w-full bg-gray-100">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-3 sm:p-4 space-y-3">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.name}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="flex-shrink-0 touch-manipulation"
              >
                <X className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-red-800">Upload Error</p>
            <p className="text-xs sm:text-sm text-red-600 mt-1">{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
