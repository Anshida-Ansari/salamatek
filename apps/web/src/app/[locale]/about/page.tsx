import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';

// ─── Client-confirmed values from Jotform ────────────────────────────────────
const VALUES_EN = [
  'Service',
  'Accountability',
  'Loyalty',
  'Accuracy',
  'Motivation',
  'Awareness',
  'Team Work',
  'Efficiency',
  'Knowledge',
];

const VALUES_AR = [
  'الخدمة',
  'المساءلة',
  'الولاء',
  'الدقة',
  'التحفيز',
  'الوعي',
  'العمل الجماعي',
  'الكفاءة',
  'المعرفة',
];
// ─────────────────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  const pa = t.pages.about;
  return {
    title: pa.title,
    description: pa.description,
    openGraph: {
      title: pa.title,
      description: pa.description,
      siteName: t.meta.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    alternates: { languages: { en: '/en/about', ar: '/ar/about' } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const pa = t.pages.about;
  const isAr = typedLocale === 'ar';
  const values = isAr ? VALUES_AR : VALUES_EN;

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'من نحن' : 'About' },
  ];

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        locale={typedLocale}
        badge={pa.heroBadge}
        heading={pa.heroHeading}
        subtext={pa.heroSubtext}
        breadcrumbs={breadcrumbs}
        imageSrc="/images/hospital/exterior.jpg"
        imageAlt={isAr ? 'مجمع سلامتك الطبي' : 'Salamatek Medical Centre'}
      />

      {/* ── 2. Introduction ─────────────────────────────────────────────── */}
      <section
        className="bg-white py-14 md:py-20"
        aria-labelledby="about-intro-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text side */}
            <div>
              <h2
                id="about-intro-heading"
                className="text-2xl md:text-display-sm font-serif font-bold text-text-base leading-snug mb-5"
              >
                {pa.introHeading}
              </h2>
              <p className="text-base md:text-lg text-text-muted leading-relaxed">
                {pa.introText}
              </p>
            </div>

            {/* Image side */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] w-full">
              <Image
                src="/images/hospital/entrance.jpg"
                alt={isAr ? 'مدخل مجمع سلامتك الطبي' : 'Salamatek Medical Centre entrance'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Mission + Vision ──────────────────────────────────────────── */}
      <section
        className="bg-surface-mint py-14 md:py-20"
        aria-labelledby="mission-vision-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="mission-vision-heading" className="sr-only">
            {isAr ? 'الرسالة والرؤية' : 'Mission and Vision'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="bg-white rounded-2xl border border-border/50 p-8 shadow-card">
              <div
                className="w-10 h-10 rounded-xl bg-brand-mint flex items-center justify-center mb-5"
                aria-hidden="true"
              >
                <svg className="w-5 h-5 text-brand-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-serif text-text-base mb-3">
                {pa.missionHeading}
              </h3>
              <p className="text-base text-text-muted leading-relaxed">
                {pa.missionText}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-brand-dark rounded-2xl p-8 shadow-card">
              <div
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5"
                aria-hidden="true"
              >
                <svg className="w-5 h-5 text-brand-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-serif text-white mb-3">
                {pa.visionHeading}
              </h3>
              <p className="text-base text-white/70 leading-relaxed">
                {pa.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Values ────────────────────────────────────────────────────── */}
      <section
        className="bg-white py-14 md:py-20"
        aria-labelledby="values-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
              {pa.valuesHeading}
            </p>
            <h2
              id="values-heading"
              className="text-2xl md:text-display-sm font-serif font-bold text-text-base leading-snug"
            >
              {pa.valuesSubtext}
            </h2>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {values.map((value, idx) => (
              <div
                key={value}
                className="group flex flex-col items-center text-center p-5 rounded-2xl border border-border hover:border-brand-pale hover:bg-surface-mint transition-all duration-200"
              >
                <span
                  className="text-xs font-bold text-brand-red mb-3 tabular-nums"
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-semibold text-text-base leading-snug">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Our Journey ───────────────────────────────────────────────── */}
      <section
        className="py-14 md:py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0C3528 0%, #1A6B4A 100%)' }}
        aria-labelledby="history-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] w-full order-2 lg:order-1">
              <Image
                src="/images/hospital/reception.jpg"
                alt={isAr ? 'مجمع سلامتك — الاستقبال' : 'Salamatek Medical Centre — reception area'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-light mb-4">
                {pa.historyHeading}
              </p>
              <h2
                id="history-heading"
                className="text-2xl md:text-display-sm font-serif font-bold text-white leading-snug mb-5"
              >
                {pa.historyHeading}
              </h2>
              <p className="text-base text-white/70 leading-relaxed max-w-md">
                {pa.historyText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA ───────────────────────────────────────────────────────── */}
      <CTASection
        heading={pa.ctaHeading}
        ctaLabel={pa.ctaBtn}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
        variant="mint"
      />
      {/* Secondary link */}
      <div className="bg-surface-mint pb-14 flex justify-center -mt-6">
        <Link
          href={getLocalizedPath('/departments', typedLocale)}
          className="text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors duration-150"
        >
          {pa.ctaLink}
        </Link>
      </div>
    </>
  );
}
