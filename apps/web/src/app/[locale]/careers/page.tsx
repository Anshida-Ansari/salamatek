import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers | Salamatek Medical Center',
  description: 'Join our team of healthcare professionals and make a difference at Salamatek Medical Center.',
};

async function getCareers() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/careers?active=true&limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  const isRtl = locale === 'ar';
  const careers = await getCareers();

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-4">
            {isRtl ? 'الوظائف' : 'Careers'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {isRtl ? 'انضم إلى فريق سلامتك الطبي' : 'Join the Salamatek Team'}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {isRtl 
              ? 'نحن نبحث دائمًا عن المواهب الاستثنائية. استكشف فرص العمل المتاحة وانضم إلينا في تقديم رعاية صحية استثنائية.' 
              : 'We are always looking for exceptional talent. Explore our open positions and join us in delivering outstanding healthcare.'}
          </p>
        </div>

        {careers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isRtl ? 'لا توجد وظائف شاغرة حالياً' : 'No current openings'}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {isRtl ? 'يرجى التحقق مرة أخرى لاحقاً. نقوم بتحديث هذه الصفحة بانتظام بالفرص الجديدة.' : 'Please check back later. We update this page regularly with new opportunities.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {careers.map((career: any) => (
              <Link 
                href={`/${locale}/careers/${career.slug}`} 
                key={career._id}
                className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-3">
                      {career.title[locale] || career.title.en}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {career.department?.[locale] && (
                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          {career.department[locale]}
                        </span>
                      )}
                      {career.location?.[locale] && (
                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {career.location[locale]}
                        </span>
                      )}
                      {career.employmentType?.[locale] && (
                        <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {career.employmentType[locale]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition ${isRtl ? '-scale-x-100' : ''}`}>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
