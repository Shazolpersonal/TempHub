'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Template } from '@/types';
import { TemplateList } from '@/components/admin/template-list';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, CheckCircle2, XCircle } from 'lucide-react';

interface AdminDashboardClientProps {
  initialTemplates: Template[];
}

type AlertType = 'success' | 'error' | null;

export function AdminDashboardClient({
  initialTemplates,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
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

  // Delete template
  const handleDelete = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete template');
      }

      // Update local state
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));

      showAlert('success', 'Template deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      showAlert(
        'error',
        error instanceof Error ? error.message : 'Failed to delete template'
      );
      throw error; // Re-throw to let TemplateList handle the error state
    }
  };

  return (
    <div>
      {/* Alert Messages */}
      {alert && (
        <div className="mb-6">
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
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Template Management</h2>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Template
        </Button>
      </div>

      {/* Template List */}
      <TemplateList
        templates={templates}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
