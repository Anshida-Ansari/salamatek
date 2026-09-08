import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';
import { services } from '@/data/services';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Pre-generate all locale × slug combos for static SSG */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  const t = getTranslations(locale as Locale);
  const name = service.name[locale as Locale];
  const desc = service.description[locale as Locale];

  return {
    title: `${name} — ${t.meta.siteName}`,
    description: desc,
    openGraph: {
      title: `${name} — ${t.meta.siteName}`,
      description: desc,
      siteName: t.meta.siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'الخدمات' : 'Services', href: getLocalizedPath('/services', typedLocale) },
    { label: service.name[typedLocale] },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'خدماتنا الطبية' : 'Medical Services'}
        heading={service.name[typedLocale]}
        subtext={service.description[typedLocale]}
        breadcrumbs={breadcrumbs}
      />

      {/* ── Content placeholder ───────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-mint flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-brand-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold font-serif text-text-base mb-3">
              {service.name[typedLocale]}
            </h2>
            <p className="text-text-muted leading-relaxed mb-6">
              {service.description[typedLocale]}
            </p>
            <p className="text-xs text-text-subtle italic">
              {t.common.placeholder}
            </p>
          </div>
        </div>
      </section>

      {/* ── Other services ────────────────────────────────────────────────── */}
      <section className="bg-surface-mint py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-5">
            {isAr ? 'خدمات أخرى' : 'Other Services'}
          </p>
          <div className="flex flex-wrap gap-3">
            {services
              .filter((s) => s.id !== service.id && s.active)
              .slice(0, 5)
              .map((s) => (
                <Link
                  key={s.id}
                  href={getLocalizedPath(`/services/${s.slug}`, typedLocale)}
                  className="px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-text-base hover:border-brand-pale hover:text-brand-dark transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium"
                >
                  {s.name[typedLocale]}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <CTASection
        heading={isAr ? 'هل تريد الاستفادة من هذه الخدمة؟' : 'Ready to use this service?'}
        subtext={isAr ? 'تواصل معنا لحجز موعدك.' : 'Contact us to schedule your appointment.'}
        ctaLabel={isAr ? 'احجز موعدًا' : 'Book an appointment'}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
        variant="dark"
      />
    </>
  );
}
