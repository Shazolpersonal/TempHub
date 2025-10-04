import { LoadingSpinner } from '@/components/loading-spinner';

export default function Loading() {
  return (
    <div className="py-12">
      <LoadingSpinner size="lg" text="Loading admin dashboard..." />
    </div>
  );
}
