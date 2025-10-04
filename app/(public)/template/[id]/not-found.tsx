import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Template Not Found
          </h1>
          <p className="text-gray-600">
            The template you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>

        <Button asChild>
          <Link href="/">
            Back to Gallery
          </Link>
        </Button>
      </div>
    </main>
  );
}
