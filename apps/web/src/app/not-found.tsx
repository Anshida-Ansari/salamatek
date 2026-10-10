import Link from 'next/link';
import Image from 'next/image';

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-surface-light min-h-screen flex flex-col items-center justify-center font-sans antialiased" suppressHydrationWarning>
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Image 
              src="/images/logo-official-transparent.png" 
              alt="Salamatek Medical Center" 
              width={200} 
              height={80} 
              className="object-contain"
            />
          </div>

          <h1 className="text-6xl sm:text-8xl font-serif font-bold text-brand-dark mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Page Not Found <br/> 
            <span className="text-xl sm:text-2xl mt-2 block font-arabic">الصفحة غير موجودة</span>
          </h2>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist. <br/><br/>
            <span className="font-arabic">عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو أنها غير موجودة.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/en"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-brand text-white font-medium hover:bg-brand-medium transition-colors shadow-sm"
            >
              Back to Home (EN)
            </Link>
            <Link
              href="/ar"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-brand text-white font-medium hover:bg-brand-medium transition-colors shadow-sm font-arabic"
            >
              العودة للرئيسية (AR)
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
