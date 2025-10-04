'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Template, Category } from '@/types';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import components for code splitting
const CategoryFilter = dynamic(
  () => import('./category-filter').then((mod) => mod.CategoryFilter),
  { ssr: true }
);

const TemplateCard = dynamic(
  () => import('./template-card').then((mod) => mod.TemplateCard),
  { ssr: true }
);

interface TemplateGalleryProps {
  initialTemplates: Template[];
  categories: Category[];
  selectedCategory?: string;
}

const ITEMS_PER_PAGE = 12;

// Loading skeleton component
function TemplateCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="aspect-video w-full bg-muted" />
        <div className="p-4 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ category }: { category: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <svg
          className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No templates found
        </h3>
        <p className="text-muted-foreground">
          {category === 'all'
            ? 'There are no templates available yet.'
            : `There are no templates in the "${category}" category yet.`}
        </p>
      </div>
    </div>
  );
}

export function TemplateGallery({
  initialTemplates,
  categories,
  selectedCategory = 'all',
}: TemplateGalleryProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [displayedTemplates, setDisplayedTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(initialTemplates);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Calculate template counts per category
  const templateCounts = initialTemplates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter templates when category changes
  useEffect(() => {
    const filtered =
      activeCategory === 'all'
        ? initialTemplates
        : initialTemplates.filter((t) => t.category === activeCategory);
    
    setFilteredTemplates(filtered);
    setPage(1);
    setDisplayedTemplates(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [activeCategory, initialTemplates]);

  // Load more templates
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate async loading with setTimeout
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newTemplates = filteredTemplates.slice(startIndex, endIndex);
      
      if (newTemplates.length > 0) {
        setDisplayedTemplates((prev) => [...prev, ...newTemplates]);
        setPage(nextPage);
        setHasMore(endIndex < filteredTemplates.length);
      } else {
        setHasMore(false);
      }
      
      setIsLoading(false);
    }, 500);
  }, [page, filteredTemplates, isLoading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, isLoading]);

  // Handle category change
  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    
    // Update URL query parameters
    const params = new URLSearchParams();
    if (slug !== 'all') {
      params.set('category', slug);
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';
    router.push(newUrl);
  };

  // Handle template click
  const handleTemplateClick = (templateId: string) => {
    router.push(`/template/${templateId}`);
  };

  return (
    <div className="w-full">
      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        templateCounts={templateCounts}
      />

      {/* Template Grid */}
      {displayedTemplates.length === 0 && !isLoading ? (
        <EmptyState category={activeCategory} />
      ) : (
        <div
          className={cn(
            'grid gap-6',
            'grid-cols-1',
            'sm:grid-cols-2',
            'lg:grid-cols-3',
            'xl:grid-cols-4'
          )}
        >
          {displayedTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => handleTemplateClick(template.id)}
              priority={index < 4}
            />
          ))}

          {/* Loading Skeletons */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <TemplateCardSkeleton key={`skeleton-${index}`} />
            ))}
        </div>
      )}

      {/* Intersection Observer Target */}
      {hasMore && displayedTemplates.length > 0 && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center mt-8"
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm">Loading more templates...</span>
            </div>
          )}
        </div>
      )}

      {/* End of results message */}
      {!hasMore && displayedTemplates.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          You&apos;ve reached the end of the list
        </div>
      )}
    </div>
  );
}
