'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplates, useDeleteTemplate } from '@/lib/hooks/use-templates';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import TemplateList for code splitting
const TemplateList = dynamic(
  () => import('@/components/admin/template-list').then((mod) => mod.TemplateList),
  {
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

type AlertType = 'success' | 'error' | null;

export function AdminDashboardClient() {
  const router = useRouter();
  const { data: templates = [], isLoading, error } = useTemplates();
  const deleteTemplateMutation = useDeleteTemplate();
  
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  // Show alert and auto-hide after 5 seconds
  const showAlert = (type: AlertType, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Navigate to create new template page
  const handleCreateNew = () => {
    router.push('/admin/templates/new');
  };

  // Navigate to edit template page
  const handleEdit = (templateId: string) => {
    router.push(`/admin/templates/${templateId}/edit`);
  };

  // Delete template using React Query mutation
  const handleDelete = async (templateId: string) => {
    try {
      await deleteTemplateMutation.mutateAsync(templateId);
      showAlert('success', 'Template deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showAlert(
        'error',
        error instanceof Error ? error.message : 'Failed to delete template'
      );
      throw error;
    }
  };

  return (
    <div>
      {/* Alert Messages */}
      {alert && (
        <div className="mb-4 sm:mb-6">
          <Alert
            variant={alert.type === 'error' ? 'destructive' : 'default'}
            className={
              alert.type === 'success'
                ? 'border-green-500 bg-green-50 text-green-900'
                : ''
            }
          >
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="text-sm">{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Template Management</h2>
        <Button 
          onClick={handleCreateNew} 
          className="gap-2 w-full sm:w-auto touch-manipulation"
        >
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Create New Template</span>
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load templates. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Template List */}
      {!isLoading && !error && (
        <TemplateList
          templates={templates}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
