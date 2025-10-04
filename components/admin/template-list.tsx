'use client';

import { useState } from 'react';
import { Template } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface TemplateListProps {
  templates: Template[];
  onEdit: (templateId: string) => void;
  onDelete: (templateId: string) => Promise<void>;
}

export function TemplateList({
  templates,
  onEdit,
  onDelete,
}: TemplateListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Open delete confirmation dialog
  const handleDeleteClick = (template: Template) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(templateToDelete.id);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Failed to delete template:', error);
      // Error handling is done in parent component
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
            <span>Templates</span>
            <span className="text-xs sm:text-sm font-normal text-muted-foreground">
              Total: {templates.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No templates found.</p>
              <p className="text-sm mt-2">
                Create your first template to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  {/* Preview Image */}
                  <div className="relative w-full sm:w-20 h-40 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={template.previewImage}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Template Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">
                      {template.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {template.category}
                      </span>
                      <span className="hidden sm:inline">Updated: {formatDate(template.updatedAt)}</span>
                      <span className="sm:hidden">{formatDate(template.updatedAt)}</span>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {template.prompt}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:flex-shrink-0 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(template.id)}
                      className="gap-2 flex-1 sm:flex-initial touch-manipulation"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(template)}
                      className="gap-2 flex-1 sm:flex-initial touch-manipulation"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{templateToDelete?.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
