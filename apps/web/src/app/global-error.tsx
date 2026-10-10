'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface-light min-h-screen flex flex-col items-center justify-center font-sans antialiased" suppressHydrationWarning>
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-10">
            <Image 
              src="/images/logo-official-transparent.png" 
              alt="Salamatek Medical Center" 
              width={200} 
              height={80} 
              className="object-contain"
            />
          </div>

          <div className="w-20 h-20 bg-red-100 text-brand-red rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-10 text-lg">
            An unexpected application error occurred. We apologize for the inconvenience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-brand text-brand font-medium hover:bg-brand/5 transition-colors shadow-sm cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/en"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-brand text-white font-medium hover:bg-brand-medium transition-colors shadow-sm"
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
