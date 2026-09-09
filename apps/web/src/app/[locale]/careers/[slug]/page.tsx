import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Briefcase, MapPin, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import JobApplicationForm from '@/components/JobApplicationForm';

async function getCareerBySlug(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/careers/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const career = await getCareerBySlug(slug);
  if (!career) return { title: 'Not Found' };
  return {
    title: `${career.title[locale] || career.title.en} | Salamatek Careers`,
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const career = await getCareerBySlug(slug);
  if (!career || !career.active) notFound();

  const isRtl = locale === 'ar';

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href={`/${locale}/careers`}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          {isRtl ? 'العودة للوظائف' : 'Back to Careers'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Job Details (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {career.title[locale] || career.title.en}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pb-8 border-b border-gray-200">
                {career.department?.[locale] && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{career.department[locale]}</span>
                  </div>
                )}
                {career.location?.[locale] && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{career.location[locale]}</span>
                  </div>
                )}
                {career.employmentType?.[locale] && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{career.employmentType[locale]}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-blue max-w-none prose-p:text-gray-600 prose-headings:text-gray-900">
              <h3>{isRtl ? 'وصف الوظيفة' : 'Job Description'}</h3>
              <p className="whitespace-pre-wrap leading-relaxed">
                {career.description[locale] || career.description.en}
              </p>

              {career.requirements?.[locale]?.length > 0 && (
                <>
                  <h3 className="mt-8">{isRtl ? 'المتطلبات والمؤهلات' : 'Requirements & Qualifications'}</h3>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    {career.requirements[locale].map((req: string, idx: number) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Application Form (Right) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <JobApplicationForm careerId={career._id} isRtl={isRtl} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
