'use client';

import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  templateCounts: Record<string, number>;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  templateCounts,
}: CategoryFilterProps) {
  const totalCount = Object.values(templateCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="w-full border-b border-gray-200 mb-6 md:mb-8">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {/* All category tab */}
        <button
          onClick={() => onCategoryChange('all')}
          className={cn(
            'px-4 py-2.5 md:px-6 md:py-3 text-sm font-medium whitespace-nowrap transition-colors relative flex-shrink-0',
            'hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-t-lg',
            'active:scale-95 touch-manipulation',
            activeCategory === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 border-b-2 border-transparent'
          )}
        >
          All
          <span
            className={cn(
              'ml-1.5 md:ml-2 px-1.5 md:px-2 py-0.5 text-xs rounded-full',
              activeCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {totalCount}
          </span>
        </button>

        {/* Category tabs */}
        {categories.map((category) => {
          const count = templateCounts[category.slug] || 0;
          const isActive = activeCategory === category.slug;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                'px-4 py-2.5 md:px-6 md:py-3 text-sm font-medium whitespace-nowrap transition-colors relative flex-shrink-0',
                'hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-t-lg',
                'active:scale-95 touch-manipulation',
                isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 border-b-2 border-transparent'
              )}
            >
              {category.name}
              <span
                className={cn(
                  'ml-1.5 md:ml-2 px-1.5 md:px-2 py-0.5 text-xs rounded-full',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
