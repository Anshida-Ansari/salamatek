'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We could log to an external service here if needed.
    console.error('Next.js caught a frontend error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-surface-light text-center">
      <div className="max-w-lg mx-auto">
        <div className="w-16 h-16 bg-red-100 text-brand-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong / حدث خطأ ما</h2>
        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
          An unexpected error occurred while loading this page. <br />
          <span className="font-arabic block mt-2">حدث خطأ غير متوقع أثناء تحميل هذه الصفحة.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-brand text-brand font-semibold hover:bg-brand/5 transition-colors shadow-sm cursor-pointer"
          >
            Try Again / حاول مجدداً
          </button>
          <Link
            href="/en"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-medium transition-colors shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
