'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Download } from 'lucide-react';
import { Template } from '@/types';
import { useUploadImage, useGenerateImage } from '@/lib/hooks/use-image-generation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';

// Dynamically import heavy components for code splitting
const ImageUploader = dynamic(
  () => import('@/components/image-uploader').then((mod) => mod.ImageUploader),
  { ssr: false }
);

const GenerationProgress = dynamic(
  () => import('@/components/generation-progress').then((mod) => mod.GenerationProgress),
  { ssr: false }
);

const ErrorDisplay = dynamic(
  () => import('@/components/error-display').then((mod) => mod.ErrorDisplay),
  { ssr: false }
);

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

  const uploadMutation = useUploadImage();
  const generateMutation = useGenerateImage();

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

  const handleGenerate = async () => {
    if (!uploadedFile) return;

    setStatus('uploading');
    setError(null);
    setProgress(0);

    try {
      // Upload image
      const uploadResult = await uploadMutation.mutateAsync(uploadedFile);
      setProgress(50);
      setStatus('generating');

      // Generate image
      const generateResult = await generateMutation.mutateAsync({
        templateId: template.id,
        imageData: uploadResult.imageData,
      });

      setProgress(100);
      setGeneratedImage(generateResult.generatedImage);
      setStatus('complete');
    } catch (err) {
      setStatus('error');
      
      // Determine if error is retryable based on error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image';
      const isRetryable = errorMessage.includes('rate limit') || 
                          errorMessage.includes('network') ||
                          errorMessage.includes('timeout');
      
      setError({
        code: errorMessage.includes('rate limit') ? 'RATE_LIMIT' : 
              errorMessage.includes('upload') ? 'UPLOAD_FAILED' : 'GENERATION_FAILED',
        message: errorMessage,
        retryable: isRetryable,
      });
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors touch-manipulation active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Template Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                {template.name}
              </h1>
              <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary capitalize">
                {template.category}
              </div>
            </div>

            {/* Template Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Template Preview</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
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
                <CardTitle className="text-base sm:text-lg">How it works</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  AI generation instructions for this template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {template.prompt}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Upload & Generate */}
          <div className="space-y-4 sm:space-y-6">
            {/* Show upload interface when idle or error (and no generated image) */}
            {(status === 'idle' || (status === 'error' && !generatedImage)) && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Upload Your Image</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
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
                  className="w-full touch-manipulation"
                  disabled={!uploadedFile}
                  onClick={handleGenerate}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Generate Image
                </Button>

                {!uploadedFile && (
                  <p className="text-xs sm:text-sm text-center text-gray-500">
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
                <CardContent className="pt-4 sm:pt-6">
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
                    <CardTitle className="text-base sm:text-lg">Generated Image</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
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
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 touch-manipulation"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 touch-manipulation"
                    onClick={handleNewGeneration}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
