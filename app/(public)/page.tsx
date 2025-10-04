import { Metadata } from 'next';
import { getAllTemplates } from '@/lib/templates';
import { TemplateGallery } from '@/components/template-gallery';
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

export default async function HomePage({ searchParams }: HomePageProps) {
  // Get category from URL query parameters
  const selectedCategory = searchParams.category || 'all';
  
  // Fetch templates on server side
  const templates = await getAllTemplates(selectedCategory !== 'all' ? selectedCategory : undefined);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TempHub
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your photos with professional AI-powered templates. 
            Upload an image and let Gemini AI create stunning results.
          </p>
        </header>

        {/* Template Gallery with Category Filter */}
        <TemplateGallery 
          initialTemplates={templates} 
          categories={categoriesData.categories}
          selectedCategory={selectedCategory}
        />
      </div>
    </main>
  );
}
