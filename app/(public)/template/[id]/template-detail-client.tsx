'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Download } from 'lucide-react';
import { Template } from '@/types';
import { ImageUploader } from '@/components/image-uploader';
import { GenerationProgress } from '@/components/generation-progress';
import { ErrorDisplay } from '@/components/error-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TemplateDetailClientProps {
  template: Template;
}

type GenerationStatus = 'idle' | 'uploading' | 'generating' | 'complete' | 'error';

interface GenerationError {
  code: string;
  message: string;
  retryable: boolean;
}

export function TemplateDetailClient({ template }: TemplateDetailClientProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<GenerationError | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Clear state when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      setUploadedFile(null);
      setStatus('idle');
      setGeneratedImage(null);
      setError(null);
      setProgress(0);
    };
  }, []);

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    setGeneratedImage(null); // Clear previous generation
    setError(null);
  };

  const handleImageUpload = async () => {
    if (!uploadedFile) return;

    setStatus('uploading');
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setProgress(50);
      
      // Proceed to generation
      await handleGeneration(data.imageData);
    } catch (err) {
      setStatus('error');
      setError({
        code: 'UPLOAD_FAILED',
        message: err instanceof Error ? err.message : 'Failed to upload image',
        retryable: true,
      });
    }
  };

  const handleGeneration = async (imageData: string) => {
    setStatus('generating');
    setProgress(50);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: template.id,
          imageData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setProgress(100);
      setGeneratedImage(data.generatedImage);
      setStatus('complete');
    } catch (err) {
      setStatus('error');
      
      // Determine if error is retryable based on error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image';
      const isRetryable = errorMessage.includes('rate limit') || 
                          errorMessage.includes('network') ||
                          errorMessage.includes('timeout');
      
      setError({
        code: errorMessage.includes('rate limit') ? 'RATE_LIMIT' : 'GENERATION_FAILED',
        message: errorMessage,
        retryable: isRetryable,
      });
    }
  };

  const handleGenerate = async () => {
    if (!uploadedFile) return;
    await handleImageUpload();
  };

  const handleRetry = () => {
    setError(null);
    setStatus('idle');
    handleGenerate();
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    // Create a download link
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-generated.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewGeneration = () => {
    setGeneratedImage(null);
    setStatus('idle');
    setError(null);
    setProgress(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Template Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {template.name}
              </h1>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                {template.category}
              </div>
            </div>

            {/* Template Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Preview</CardTitle>
                <CardDescription>
                  Example of what your generated image will look like
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={template.previewImage}
                    alt={template.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            {/* Template Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How it works</CardTitle>
                <CardDescription>
                  AI generation instructions for this template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {template.prompt}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Upload & Generate */}
          <div className="space-y-6">
            {/* Show upload interface when idle or error (and no generated image) */}
            {(status === 'idle' || (status === 'error' && !generatedImage)) && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Your Image</CardTitle>
                    <CardDescription>
                      Upload an image to transform using this template
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageUploader onUpload={handleUpload} />
                  </CardContent>
                </Card>

                {/* Generate Button */}
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!uploadedFile}
                  onClick={handleGenerate}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Image
                </Button>

                {!uploadedFile && (
                  <p className="text-sm text-center text-gray-500">
                    Upload an image to enable generation
                  </p>
                )}

                {/* Error Display */}
                {error && (
                  <ErrorDisplay error={error} onRetry={handleRetry} />
                )}
              </>
            )}

            {/* Show progress during upload and generation */}
            {(status === 'uploading' || status === 'generating') && (
              <Card>
                <CardContent className="pt-6">
                  <GenerationProgress 
                    status={status} 
                    progress={progress}
                  />
                </CardContent>
              </Card>
            )}

            {/* Show generated image when complete */}
            {status === 'complete' && generatedImage && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generated Image</CardTitle>
                    <CardDescription>
                      Your AI-generated image is ready!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={generatedImage}
                        alt="Generated image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleDownload}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={handleNewGeneration}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate New
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
