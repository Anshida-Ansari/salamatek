import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { OPTICAL_BRANDS } from '@/lib/constants';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getPageHero(pageKey: string) {
  try {
    const apiUrl =
      (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/page-heroes/${pageKey}`, {
      next: { revalidate: 60, tags: ['page-heroes'] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  const p = t.pages.opticalBrands;

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

function BrandLogo({ brand }: { brand: { name: string; image: string } }) {
  const logoUrl = `/images/opticals/${brand.image}`;

  return (
    <div className="relative w-full h-20 md:h-24 flex items-center justify-center transition-all duration-300 group overflow-hidden bg-white rounded-2xl p-2 border border-border/70 hover:border-brand-pale/80 shadow-xs hover:shadow-card hover:-translate-y-1">
      <Image
        src={logoUrl}
        alt={`${brand.name} Logo`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        className="object-contain p-2 md:p-3 transition-transform duration-500 ease-out group-hover:scale-105 mix-blend-multiply"
      />
    </div>
  );
}

export default async function OpticalBrandsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const isAr = typedLocale === 'ar';

  const heroSetting = await getPageHero('optical-brands');

  const pageTitle = isAr
    ? 'العلامات التجارية للبصريات'
    : 'Our Optical Brands';

  const subtext = isAr
    ? 'اكتشف مجموعتنا المتميزة من النظارات الطبية والشمسية من أشهر العلامات التجارية العالمية.'
    : 'Discover our premium selection of optical frames and sunglasses from world-renowned brands.';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: pageTitle },
  ];

  return (
    <>
      <PageHero
        locale={typedLocale}
        badge={pageTitle}
        heading={pageTitle}
        subtext={subtext}
        imageSrc={heroSetting?.image}
        breadcrumbs={breadcrumbs}
      />

      {/* Optical Brands Grid — exact homepage content */}
      <section className="bg-[#F8FAF9] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
              {pageTitle}
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
              {subtext}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
            {OPTICAL_BRANDS.map((brand, idx) => (
              <div
                key={idx}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)]"
              >
                <BrandLogo brand={brand} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
