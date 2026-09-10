import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getHealthPackages() {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/health-packages?active=true&limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

async function getPageHero(pageKey: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      cache: 'no-store',
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
    title: t.pages.healthPackages.title,
    description: t.pages.healthPackages.description,
  };
}

export default async function HealthPackagesPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const p = t.pages.healthPackages;
  
  const [packages, heroSetting] = await Promise.all([
    getHealthPackages(),
    getPageHero('health-packages')
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

      <section className="py-16 md:py-24 bg-surface-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {packages.length === 0 ? (
            <div className="text-center py-20 text-text-muted">
              {t.common.placeholder || 'No health packages found.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg: any) => (
                <div
                  key={pkg._id}
                  className="group flex flex-col bg-white border border-border rounded-2xl p-6 hover:border-brand-pale hover:shadow-card-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-mint flex items-center justify-center text-brand-medium mb-5">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-text-base mb-3">
                    {pkg.name[typedLocale] || pkg.name.en}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {pkg.description?.[typedLocale] || pkg.description?.en || ''}
                  </p>
                  <div className="font-semibold text-brand-medium">
                    {pkg.price ? `${pkg.price} SAR` : 'Contact for pricing'}
                  </div>
                </div>
              ))}
            </div>
          )}
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
