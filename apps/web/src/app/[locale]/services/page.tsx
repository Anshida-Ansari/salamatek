import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';
import { ServicesDirectory } from './ServicesDirectory';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getServices() {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/services?active=true&limit=150`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

async function getServiceCategories() {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(
      `${apiUrl}/service-categories?active=true&limit=50`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

async function getPageHero(pageKey: string) {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);

  return {
    title: t.pages.services.title,
    description: t.pages.services.description,
    openGraph: {
      title: t.pages.services.title,
      description: t.pages.services.description,
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const p = t.pages.services;
  const isAr = typedLocale === 'ar';

  const [services, categories, heroSetting] = await Promise.all([
    getServices(),
    getServiceCategories(),
    getPageHero('services'),
  ]);

  return (
    <>
      <PageHero
        locale={typedLocale}
        badge={p.title}
        heading={p.title}
        subtext={p.description}
        imageSrc={heroSetting?.image}
      />

      {/* Main Services Section with Interactive Category Filter & Unified Grid */}
      <section className="py-14 md:py-20 bg-surface-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ServicesDirectory
            services={services}
            categories={categories}
            locale={typedLocale}
          />
        </div>
      </section>

      {/* Digital Integration & Certification Section */}
      <section className="py-16 md:py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isAr ? 'اعتمادات حكومية رسمية' : 'Official Government Endorsements'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              {isAr
                ? 'التكامل والاعتماد الرقمي المعتمد'
                : 'Digital Integration & Certification'}
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              {isAr
                ? 'خدماتنا الطبية معتمدة ومتكاملة رقمياً وبشكل فوري مع المنصات والأنظمة الحكومية السعودية الرسمية لضمان سرعة إنجاز معاملاتكم.'
                : 'Our medical examinations and certifications are digitally integrated with official Saudi government health systems for rapid, automated processing.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Sehhaty System */}
            <div className="bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {isAr ? 'منصة صحتي' : 'Sehhaty System'}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {isAr
                    ? 'ربط مباشر لشهادات اللياقة وفحوصات الإقامة الرسمية (إفادة) واعتمادها الفوري لدى وزارة الصحة السعودية.'
                    : 'Direct synchronization for official medical fitness certifications and residency health reports with the Saudi Ministry of Health.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {isAr ? 'تكامل رقمي فوري' : 'Live Electronic Sync'}
              </div>
            </div>

            {/* Moroor System */}
            <div className="bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.375c0-.621-.504-1.125-1.125-1.125h-9.75c-.621 0-1.125.504-1.125 1.125v10.875m12 0H3.375"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {isAr ? 'نظام المرور' : 'Moroor System'}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {isAr
                    ? 'تسجيل وإرسال نتائج فحص رخص القيادة وقياس النظر إلكترونياً وبشكل فوري للإدارة العامة للمرور.'
                    : 'Electronic registration and instant submission of driving license medical exams and eye tests to the General Directorate of Traffic.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {isAr ? 'ربط آلي معتمد' : 'Authorized Gateway'}
              </div>
            </div>

            {/* Absher Portal */}
            <div className="bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {isAr ? 'منصة أبشر' : 'Absher Portal'}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {isAr
                    ? 'توثيق رسمي وتأكيد رقمي مؤمّن لنتائج الفحوصات الطبية عبر البوابة الوطنية الموحدة لتسهيل الإجراءات الحكومية.'
                    : 'Secure governmental authentication of verified medical records through the unified national portal for streamlined citizen and resident procedures.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {isAr ? 'توثيق حكومي رسمي' : 'National Portal Integration'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        heading={t.pages.home.appointmentHeading}
        subtext={t.pages.home.appointmentSubtext}
        ctaLabel={t.common.bookNow}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}
