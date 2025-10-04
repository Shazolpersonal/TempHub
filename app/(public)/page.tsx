import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTemplates } from '@/lib/templates';
import { TemplateGallery } from '@/components/template-gallery';
import { LoadingSpinner } from '@/components/loading-spinner';
import categoriesData from '@/data/categories.json';

export const metadata: Metadata = {
  title: 'TempHub - AI-Powered Image Generation Templates',
  description: 'Transform your photos with professional AI-powered templates. Create magazine covers, product shots, and more using Google Gemini AI.',
  keywords: ['AI image generation', 'photo templates', 'Gemini AI', 'creative images', 'photo transformation'],
  openGraph: {
    title: 'TempHub - AI-Powered Image Generation Templates',
    description: 'Transform your photos with professional AI-powered templates',
    type: 'website',
  },
};

interface HomePageProps {
  searchParams: { category?: string };
}

async function TemplateGalleryWrapper({ selectedCategory }: { selectedCategory: string }) {
  // Fetch templates on server side
  const templates = await getAllTemplates(selectedCategory !== 'all' ? selectedCategory : undefined);
  
  return (
    <TemplateGallery 
      initialTemplates={templates} 
      categories={categoriesData.categories}
      selectedCategory={selectedCategory}
    />
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  // Get category from URL query parameters
  const selectedCategory = searchParams.category || 'all';
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            TempHub
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Transform your photos with professional AI-powered templates. 
            Upload an image and let Gemini AI create stunning results.
          </p>
        </header>

        {/* Template Gallery with Category Filter */}
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading templates..." />}>
          <TemplateGalleryWrapper selectedCategory={selectedCategory} />
        </Suspense>
      </div>
    </main>
  );
}
