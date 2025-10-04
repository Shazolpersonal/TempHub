'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends ImageProps {
  showLoader?: boolean;
}

export function OptimizedImage({ 
  showLoader = true,
  className,
  alt,
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {showLoader && isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <Image
        {...props}
        alt={alt}
        className={cn(
          className,
          isLoading && showLoader ? 'opacity-0' : 'opacity-100',
          'transition-opacity duration-300'
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
