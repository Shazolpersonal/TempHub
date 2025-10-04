/**
 * Template Form Component Usage Examples
 * 
 * This file demonstrates how to use the TemplateForm component
 * in both create and edit modes.
 */

import { TemplateForm } from '@/components/admin/template-form';
import { Template, Category, TemplateFormData } from '@/types';

// Sample categories data
const sampleCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Magazine',
    slug: 'magazine',
    description: 'Magazine covers and editorial styles',
  },
  {
    id: 'cat-2',
    name: 'Product',
    slug: 'product',
    description: 'Product photography and marketing',
  },
  {
    id: 'cat-3',
    name: 'Character',
    slug: 'character',
    description: 'Character transformations and portraits',
  },
];

// Sample template for edit mode
const sampleTemplate: Template = {
  id: 'uuid-1',
  name: 'TIME Magazine Cover',
  category: 'magazine',
  prompt:
    'Create a professional TIME Magazine cover featuring the person in the uploaded image. The cover should have the iconic TIME red border, the TIME logo at the top, and the person should be photographed in a professional, editorial style.',
  previewImage: '/template-previews/time-magazine.jpg',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

// Example 1: Create Mode
export function CreateTemplateExample() {
  const handleSubmit = async (data: TemplateFormData) => {
    console.log('Creating template:', data);
    
    // API call to create template
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create template');
    }

    const result = await response.json();
    console.log('Template created:', result);
  };

  const handleCancel = () => {
    console.log('Create cancelled');
    // Navigate back to admin dashboard
  };

  return (
    <div className="container mx-auto py-8">
      <TemplateForm
        categories={sampleCategories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

// Example 2: Edit Mode
export function EditTemplateExample() {
  const handleSubmit = async (data: TemplateFormData) => {
    console.log('Updating template:', data);
    
    // API call to update template
    const response = await fetch(`/api/templates/${sampleTemplate.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update template');
    }

    const result = await response.json();
    console.log('Template updated:', result);
  };

  const handleCancel = () => {
    console.log('Edit cancelled');
    // Navigate back to admin dashboard
  };

  return (
    <div className="container mx-auto py-8">
      <TemplateForm
        template={sampleTemplate}
        categories={sampleCategories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

// Example 3: With Error Handling
export function TemplateFormWithErrorHandling() {
  const handleSubmit = async (data: TemplateFormData) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create template');
      }

      const result = await response.json();
      console.log('Success:', result);
      
      // Show success message or redirect
      alert('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      // Error will be caught by the form component
      throw error;
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      console.log('Cancelled');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <TemplateForm
        categories={sampleCategories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

// Example 4: With Router Integration (Next.js)
export function TemplateFormWithRouter() {
  // In a real Next.js component, you would use:
  // const router = useRouter();
  
  const handleSubmit = async (data: TemplateFormData) => {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // router.push('/admin');
      console.log('Redirecting to admin dashboard');
    } else {
      throw new Error('Failed to create template');
    }
  };

  const handleCancel = () => {
    // router.back();
    console.log('Navigating back');
  };

  return (
    <div className="container mx-auto py-8">
      <TemplateForm
        categories={sampleCategories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
