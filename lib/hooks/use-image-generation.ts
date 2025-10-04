'use client';

import { useMutation } from '@tanstack/react-query';

interface UploadImageResponse {
  imageUrl: string;
  imageData: string;
}

interface GenerateImageRequest {
  templateId: string;
  imageData: string;
}

interface GenerateImageResponse {
  generatedImage: string;
  mimeType: string;
}

// Upload image
async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }
  
  return response.json();
}

// Generate image
async function generateImage(request: GenerateImageRequest): Promise<GenerateImageResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate image');
  }
  
  return response.json();
}

// Hook to upload image
export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}

// Hook to generate image
export function useGenerateImage() {
  return useMutation({
    mutationFn: generateImage,
  });
}
