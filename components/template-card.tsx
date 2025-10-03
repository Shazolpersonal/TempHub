'use client';

import Image from 'next/image';
import { Template } from '@/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: Template;
  onClick?: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={template.previewImage}
          alt={`${template.name} preview`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Category Badge - Positioned on image */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
              'bg-background/90 backdrop-blur-sm shadow-sm',
              'border border-border'
            )}
          >
            {template.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {template.name}
        </h3>
      </div>
    </Card>
  );
}
