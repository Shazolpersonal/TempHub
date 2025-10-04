'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Template, TemplateFormData } from '@/types';

// Query keys
export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (category?: string) => [...templateKeys.lists(), { category }] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

// Fetch all templates with optional category filter
async function fetchTemplates(category?: string): Promise<Template[]> {
  const url = category && category !== 'all' 
    ? `/api/templates?category=${category}` 
    : '/api/templates';
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  
  const data = await response.json();
  return data.templates;
}

// Fetch single template by ID
async function fetchTemplate(id: string): Promise<Template> {
  const response = await fetch(`/api/templates/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch template');
  }
  
  const data = await response.json();
  return data.template;
}

// Create new template
async function createTemplate(data: TemplateFormData): Promise<Template> {
  const response = await fetch('/api/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create template');
  }
  
  const result = await response.json();
  return result.template;
}

// Update existing template
async function updateTemplate(id: string, data: TemplateFormData): Promise<Template> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update template');
  }
  
  const result = await response.json();
  return result.template;
}

// Delete template
async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`/api/templates/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete template');
  }
}

// Hook to fetch all templates
export function useTemplates(category?: string) {
  return useQuery({
    queryKey: templateKeys.list(category),
    queryFn: () => fetchTemplates(category),
  });
}

// Hook to fetch single template
export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => fetchTemplate(id),
    enabled: !!id,
  });
}

// Hook to create template
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      // Invalidate and refetch templates list
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

// Hook to update template
export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TemplateFormData }) =>
      updateTemplate(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific template and lists
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

// Hook to delete template
export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      // Invalidate templates list
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}
