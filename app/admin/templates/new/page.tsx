'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TemplateForm } from '@/components/admin/template-form';
import { Category, TemplateFormData } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewTemplatePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData: TemplateFormData) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create template');
      }

      const data = await response.json();
      console.log('Template created successfully:', data);

      // Redirect to admin dashboard on success
      router.push('/admin');
    } catch (err) {
      console.error('Error creating template:', err);
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
          <p className="text-muted-foreground">Loading...</p>
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
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <TemplateForm
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
