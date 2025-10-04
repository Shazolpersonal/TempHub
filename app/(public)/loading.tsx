import { LoadingSpinner } from '@/components/loading-spinner';

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Skeleton */}
        <header className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="h-10 sm:h-12 md:h-14 bg-muted rounded-lg w-48 mx-auto mb-3 sm:mb-4 animate-pulse" />
          <div className="h-6 sm:h-7 bg-muted rounded-lg max-w-2xl mx-auto animate-pulse" />
        </header>

        {/* Loading Spinner */}
        <div className="py-12">
          <LoadingSpinner size="lg" text="Loading templates..." />
        </div>
      </div>
    </main>
  );
}
