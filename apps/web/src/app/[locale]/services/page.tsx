import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';
import { services } from '@/data/services';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  const ps = t.pages.services;
  return {
    title: ps.title,
    description: ps.description,
    openGraph: {
      title: ps.title,
      description: ps.description,
      siteName: t.meta.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    alternates: { languages: { en: '/en/services', ar: '/ar/services' } },
  };
}

// Icon renderer for services
function ServiceIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    'alert-circle': (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    ),
    stethoscope: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    'flask-conical': (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.096.04a3.75 3.75 0 012.44 4.023 6.75 6.75 0 01-6.726 6.016h-.09A6.75 6.75 0 016.25 15.52a3.75 3.75 0 012.44-4.023l.096-.04a2.25 2.25 0 001.357-2.059V3.104" />
    ),
    activity: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
    sparkles: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    ),
    smile: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
    ),
    eye: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
    heart: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    ),
    baby: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    glasses: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    ),
  };

  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {icons[id] ?? icons['stethoscope']}
    </svg>
  );
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const ps = t.pages.services;
  const isAr = typedLocale === 'ar';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'الخدمات' : 'Services' },
  ];

  const activeServices = services.filter((s) => s.active);

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        locale={typedLocale}
        badge={ps.heroBadge}
        heading={ps.heroHeading}
        subtext={ps.heroSubtext}
        breadcrumbs={breadcrumbs}
        imageSrc="/images/hospital/emergency-ward.jpg"
        imageAlt={isAr ? 'خدمات مجمع سلامتك الطبي' : 'Salamatek Medical Centre services'}
      />

      {/* ── 2. Services Grid ─────────────────────────────────────────────── */}
      <section
        className="bg-white py-14 md:py-20"
        aria-labelledby="services-list-heading"
        id="services-list"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
              {ps.listHeading}
            </p>
            <h2
              id="services-list-heading"
              className="text-2xl md:text-display-sm font-serif font-bold text-text-base leading-snug mb-2"
            >
              {ps.listHeading}
            </h2>
            <p className="text-sm text-text-muted max-w-lg">
              {ps.listSubtext}
            </p>
          </div>

          {/* Services grid — 2 columns on sm, 3 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeServices.map((service) => (
              <Link
                key={service.id}
                href={getLocalizedPath(`/services/${service.slug}`, typedLocale)}
                className="group flex flex-col bg-white border border-border rounded-2xl p-6 hover:border-brand-pale hover:shadow-card-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium"
                aria-label={`${service.name[typedLocale]} — ${service.description[typedLocale]}`}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-surface-mint flex items-center justify-center text-brand-medium mb-5 group-hover:bg-brand-dark group-hover:text-white transition-colors duration-200">
                  <ServiceIcon id={service.icon} />
                </div>

                {/* Name */}
                <h3 className="text-base font-semibold text-text-base mb-2 leading-snug">
                  {service.name[typedLocale]}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-muted leading-relaxed flex-1 mb-4">
                  {service.description[typedLocale]}
                </p>

                {/* Learn more */}
                <span className="text-xs font-semibold text-brand-red group-hover:text-brand-red-dark transition-colors duration-150">
                  {t.common.learnMore} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CTA ───────────────────────────────────────────────────────── */}
      <CTASection
        heading={ps.ctaHeading}
        subtext={ps.ctaSubtext}
        ctaLabel={ps.ctaBtn}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
        variant="dark"
      />
    </>
  );
}
