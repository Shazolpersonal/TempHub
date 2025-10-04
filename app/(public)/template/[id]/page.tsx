import { notFound } from 'next/navigation';
import { getTemplateById } from '@/lib/templates';
import { TemplateDetailClient } from './template-detail-client';

export default async function TemplatePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Fetch template data on server side
  const template = await getTemplateById(params.id);

  // If template not found, show 404
  if (!template) {
    notFound();
  }

  return <TemplateDetailClient template={template} />;
}
