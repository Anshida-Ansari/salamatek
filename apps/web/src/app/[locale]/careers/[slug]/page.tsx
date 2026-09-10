import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Briefcase, MapPin, Clock, ChevronLeft, CheckCircle2, ShieldCheck, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import JobApplicationForm from '@/components/JobApplicationForm';
import { PageHero } from '@/components/shared/PageHero';
import { isValidLocale, type Locale } from '@/i18n/config';

async function getCareerBySlug(slug: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/careers/slug/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
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
  const title = career.title?.[locale] || career.title?.en || 'Career Opportunity';
  return {
    title: `${title} | Salamatek Medical Centre`,
    description: career.description?.[locale] || career.description?.en || '',
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const isRtl = typedLocale === 'ar';

  const career = await getCareerBySlug(slug);
  if (!career || !career.active) notFound();

  const title = career.title?.[typedLocale] || career.title?.en || 'Job Opportunity';
  const dept = career.department?.[typedLocale] || career.department?.en;
  const location = career.location?.[typedLocale] || career.location?.en || (isRtl ? 'صفوى، المنطقة الشرقية' : 'Safwa, Eastern Province');
  const type = career.employmentType?.[typedLocale] || career.employmentType?.en || (isRtl ? 'دوام كامل' : 'Full-time');
  const desc = career.description?.[typedLocale] || career.description?.en;
  const reqs = career.requirements?.[typedLocale] || career.requirements?.en || [];

  return (
    <main className="min-h-screen bg-[#F8FAF9]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Standard Brand Page Hero */}
      <PageHero
        locale={typedLocale}
        badge={dept || (isRtl ? 'فرصة عمل شاغرة' : 'Open Healthcare Position')}
        heading={title}
        subtext={`${location} • ${type}`}
        imageSrc="/images/hospital/reception.jpg"
        imageAlt={title}
        breadcrumbs={[
          { label: isRtl ? 'الرئيسية' : 'Home', href: `/${locale}` },
          { label: isRtl ? 'الوظائف' : 'Careers', href: `/${locale}/careers` },
          { label: title },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <Link 
          href={`/${locale}/careers`}
          className={`inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-brand transition mb-8 group ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isRtl ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          <span>{isRtl ? 'العودة لجميع الوظائف الشاغرة' : 'Back to All Positions'}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Job Details & Description (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Metadata Bar */}
            <div className="bg-white rounded-3xl p-6 border border-border shadow-card flex flex-wrap items-center gap-6">
              {dept && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-mint text-brand flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-bold text-text-muted">{isRtl ? 'القسم' : 'Department'}</p>
                    <p className="text-sm font-bold text-brand-dark">{dept}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-mint text-brand flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-text-muted">{isRtl ? 'نوع العمل' : 'Job Type'}</p>
                  <p className="text-sm font-bold text-brand-dark">{type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-mint text-brand flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-text-muted">{isRtl ? 'الموقع' : 'Location'}</p>
                  <p className="text-sm font-bold text-brand-dark">{location}</p>
                </div>
              </div>
            </div>

            {/* Job Description Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-4">
              <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" />
                <span>{isRtl ? 'تفاصيل الدور والمسؤوليات' : 'Role Overview & Responsibilities'}</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-brand-dark">
                {isRtl ? 'الوصف الوظيفي' : 'Job Description'}
              </h2>
              <div className="text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line pt-2">
                {desc}
              </div>
            </div>

            {/* Requirements & Qualifications */}
            {reqs.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-4">
                <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isRtl ? 'الشروط المطلوبة' : 'Candidate Profile'}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-brand-dark">
                  {isRtl ? 'المتطلبات والمؤهلات' : 'Requirements & Qualifications'}
                </h2>
                <ul className="space-y-3 pt-2">
                  {reqs.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-text-muted">
                      <div className="w-5 h-5 rounded-full bg-surface-mint text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sticky Application Form (Right 5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <JobApplicationForm careerId={career._id} isRtl={isRtl} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
