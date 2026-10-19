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



      <CTASection
        heading={t.pages.home.appointmentHeading}
        subtext={t.pages.home.appointmentSubtext}
        ctaLabel={t.common.bookNow}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}
