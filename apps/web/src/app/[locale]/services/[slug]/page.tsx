import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getServices() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/services?active=true&limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

/** Pre-generate all locale × slug combos for static SSG */
export async function generateStaticParams() {
  const services = await getServices();
  return LOCALES.flatMap((locale) =>
    services.map((s: any) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const services = await getServices();
  const service = services.find((s: any) => s.slug === slug);
  if (!service) return {};

  const t = getTranslations(locale as Locale);
  const name = service.name[locale as Locale] || service.name.en;
  const desc = service.description?.[locale as Locale] || service.description?.en || '';

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

  const services = await getServices();
  const service = services.find((s: any) => s.slug === slug);
  if (!service) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';

  const name = service.name[typedLocale] || service.name.en;
  const desc = service.description?.[typedLocale] || service.description?.en || '';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'الخدمات' : 'Services', href: getLocalizedPath('/services', typedLocale) },
    { label: name },
  ];

  return (
    <>
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'الخدمات الطبية' : 'Medical Services'}
        heading={name}
        subtext={desc}
        breadcrumbs={breadcrumbs}
        imageSrc={service.image}
      />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-text-base mb-6">
              {isAr ? 'حول هذه الخدمة' : 'About this service'}
            </h2>
            <div className="prose prose-brand max-w-none text-text-muted">
              <p>{desc}</p>
              <p className="mt-4 italic text-sm">
                {t.common.placeholder}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-mint py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-5">
            {isAr ? 'خدمات أخرى' : 'Other Services'}
          </p>
          <div className="flex flex-wrap gap-3">
            {services
              .filter((s: any) => s._id !== service._id)
              .slice(0, 5)
              .map((s: any) => (
                <Link
                  key={s._id}
                  href={getLocalizedPath(`/services/${s.slug}`, typedLocale)}
                  className="px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-text-base hover:border-brand-pale hover:bg-white hover:text-brand-dark transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium"
                >
                  {s.name[typedLocale] || s.name.en}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <CTASection 
        heading={isAr ? 'احجز خدمة اليوم' : 'Book a service today'}
        subtext={isAr ? 'فريقنا مستعد لمساعدتك.' : 'Our team is ready to help you.'}
        ctaLabel={t.common.bookNow}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}
