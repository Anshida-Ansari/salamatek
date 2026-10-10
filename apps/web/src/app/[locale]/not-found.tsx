import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-surface-light text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-brand-dark mb-4 drop-shadow-sm">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found / الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. <br />
          <span className="font-arabic block mt-2">عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/en"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-medium transition-colors shadow-sm"
          >
            Back to Home
          </Link>
          <Link
            href="/ar"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-medium transition-colors shadow-sm font-arabic"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
