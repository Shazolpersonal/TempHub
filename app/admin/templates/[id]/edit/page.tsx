'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TemplateForm } from '@/components/admin/template-form';
import { Category, Template, TemplateFormData } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch template and categories on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch template data
        const templateResponse = await fetch(`/api/templates/${templateId}`);
        if (!templateResponse.ok) {
          if (templateResponse.status === 404) {
            throw new Error('Template not found');
          }
          throw new Error('Failed to fetch template');
        }
        const templateData = await templateResponse.json();
        setTemplate(templateData.data.template);

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load template data'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [templateId]);

  // Handle form submission
  const handleSubmit = async (formData: TemplateFormData) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update template');
      }

      const data = await response.json();
      console.log('Template updated successfully:', data);

      // Redirect to admin dashboard on success
      router.push('/admin');
    } catch (err) {
      console.error('Error updating template:', err);
      throw err; // Re-throw to let the form handle the error
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>Template not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <TemplateForm
        template={template}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
