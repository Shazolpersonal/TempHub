import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { WebVitals } from './web-vitals';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'TempHub - AI Image Generation Platform',
  description: 'Create professional-quality images with AI-powered templates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <QueryProvider>
            {children}
            <WebVitals />
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
