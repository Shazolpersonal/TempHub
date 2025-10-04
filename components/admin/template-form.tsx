'use client';

import { useState, useEffect } from 'react';
import { Template, TemplateFormData, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface TemplateFormProps {
  template?: Template;
  categories: Category[];
  onSubmit: (data: TemplateFormData) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  category?: string;
  prompt?: string;
  previewImage?: string;
}

export function TemplateForm({
  template,
  categories,
  onSubmit,
  onCancel,
}: TemplateFormProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: template?.name || '',
    category: template?.category || '',
    prompt: template?.prompt || '',
    previewImage: template?.previewImage || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(
    template?.previewImage || ''
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditMode = !!template;

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Template name must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt is required';
    } else if (formData.prompt.trim().length < 20) {
      newErrors.prompt = 'Prompt must be at least 20 characters';
    }

    if (!formData.previewImage && !imageFile) {
      newErrors.previewImage = 'Preview image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        previewImage: 'Invalid file type. Please upload JPG, PNG, or WEBP',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({
        ...errors,
        previewImage: 'File size must be less than 5MB',
      });
      return;
    }

    // Clear previous error
    setErrors({ ...errors, previewImage: undefined });

    // Set file and create preview
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      setFormData({ ...formData, previewImage: result });
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        ...errors,
        name: 'Failed to save template. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit Template' : 'Create New Template'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Template Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., TIME Magazine Cover"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger
                className={errors.category ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Prompt Textarea */}
          <div className="space-y-2">
            <Label htmlFor="prompt">
              Generation Prompt <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Enter detailed instructions for the AI to generate images in a specific style..."
              rows={8}
              className={errors.prompt ? 'border-red-500' : ''}
            />
            <p className="text-sm text-muted-foreground">
              Provide detailed instructions for how the AI should transform the
              uploaded image. Be specific about style, composition, and desired
              output.
            </p>
            {errors.prompt && (
              <p className="text-sm text-red-500">{errors.prompt}</p>
            )}
          </div>

          {/* Preview Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="previewImage">
              Preview Image <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-4">
              <Input
                id="previewImage"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className={errors.previewImage ? 'border-red-500' : ''}
              />
              <p className="text-sm text-muted-foreground">
                Upload an example image showing what this template produces.
                Max size: 5MB. Formats: JPG, PNG, WEBP
              </p>
              {errors.previewImage && (
                <p className="text-sm text-red-500">{errors.previewImage}</p>
              )}

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="relative w-full max-w-md h-64 border rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Template'
                : 'Create Template'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
