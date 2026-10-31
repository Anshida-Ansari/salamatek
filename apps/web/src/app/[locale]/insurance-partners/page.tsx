import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { INSURANCE_PARTNERS } from '@/lib/constants';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getPageHero(pageKey: string) {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

async function getInsurancePartners() {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/insurance-partners?active=true`, {
      cache: 'no-store',
    });
    if (!res.ok) return INSURANCE_PARTNERS;
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return INSURANCE_PARTNERS;
  } catch {
    return INSURANCE_PARTNERS;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  const p = t.pages.insurancePartners;

  return {
    title: p.title,
    description: p.description,
    openGraph: {
      title: p.title,
      description: p.description,
      siteName: t.meta.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
  };
}

function InsuranceLogo({ partner }: { partner: { name: string; image: string } }) {
  const isExternalOrAbsolute =
    partner.image.startsWith('http://') ||
    partner.image.startsWith('https://') ||
    partner.image.startsWith('/');
  const logoUrl = isExternalOrAbsolute ? partner.image : `/images/insurance/${partner.image}`;

  return (
    <div className="relative w-full h-20 md:h-24 flex items-center justify-center transition-all duration-300 group overflow-hidden bg-white rounded-2xl p-2 border border-border/70 hover:border-brand-pale/80 shadow-xs hover:shadow-card hover:-translate-y-1">
      <Image
        src={logoUrl}
        alt={`${partner.name} Logo`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-contain p-2 md:p-3 transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
      />
    </div>
  );
}

export default async function InsurancePartnersPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const isAr = typedLocale === 'ar';
  const t = getTranslations(typedLocale);
  const p = t.pages.insurancePartners;

  const [heroSetting, partners] = await Promise.all([
    getPageHero('insurance-partners'),
    getInsurancePartners(),
  ]);

  const pageTitle = isAr
    ? 'شركاء التأمين'
    : 'Our Insurance Partners';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: pageTitle },
  ];

  const chiUrl = isAr
    ? 'https://www.chi.gov.sa/ar/ServicesDirectory/pages/eservices-checkinsurance.aspx'
    : 'https://www.chi.gov.sa/en/ServicesDirectory/pages/eservices-checkinsurance.aspx';

  return (
    <>
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'شركاء التأمين' : 'Insurance Network'}
        heading={pageTitle}
        imageSrc={heroSetting?.image || '/images/hospital/reception.jpg'}
        imageAlt={pageTitle}
        breadcrumbs={breadcrumbs}
      />

      {/* 1. Official CHI Insurance Information Inquiry Service (Top Feature Section) */}
      <section
        className="bg-white py-10 sm:py-14 border-b border-border/60"
        aria-labelledby="chi-inquiry-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-6 sm:p-8 md:p-10 border border-emerald-900/10 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{p.inquiryBadge}</span>
              </div>

              <h2
                id="chi-inquiry-heading"
                className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark tracking-tight"
              >
                {p.inquiryTitle}
              </h2>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl">
                {p.inquiryDescription}
              </p>

              <p className="text-xs text-gray-500 pt-0.5">
                {p.inquiryNote}
              </p>
            </div>

            <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <a
                href={chiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand text-white font-semibold text-sm sm:text-base hover:bg-brand-dark shadow-sm hover:shadow-md transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                aria-label={`${p.inquiryBtn} (${isAr ? 'يفتح في علامة تبويب جديدة' : 'opens in a new tab'})`}
              >
                <span>{p.inquiryBtn}</span>
                <ExternalLink className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Insurance Partners Directory Grid */}
      <section
        className="bg-[#F8FAF9] py-14 md:py-20"
        aria-label={isAr ? 'قائمة شركات التأمين المعتمدة' : 'Accepted Insurance Providers'}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Subheading */}
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold mb-2.5">
              {isAr ? 'الشبكة المعتمدة' : 'Accepted Network'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-dark tracking-tight">
              {isAr ? 'شبكة شركات التأمين المعتمدة لدى سلامتك' : 'Accepted Insurance Network at Salamatek'}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {isAr
                ? 'نتعاون مع نخبة من كبرى شركات التأمين في المملكة لضمان حصولكم على رعاية صحية سلسة وشاملة.'
                : 'Partnered with leading health insurance providers across the Kingdom to offer seamless, comprehensive coverage.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
            {partners.map((partner: any, idx: number) => (
              <div
                key={partner._id || partner.name || idx}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]"
              >
                <InsuranceLogo partner={partner} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
