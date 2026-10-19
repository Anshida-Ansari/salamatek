import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';
import { OPTICAL_BRANDS } from '@/lib/constants';
import { Glasses, Sparkles, ShieldCheck, Eye } from 'lucide-react';

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

export default async function OpticalBrandsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';

  const heroSetting = await getPageHero('optical-brands');

  const pageTitle = isAr
    ? 'العلامات التجارية للبصريات'
    : 'Our Optical Brands';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: pageTitle },
  ];

  return (
    <>
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'قسم البصريات' : 'Salamatek Optical'}
        heading={pageTitle}
        subtext={
          isAr
            ? 'اكتشف مجموعتنا الحصرية والمتميزة من النظارات الطبية والشمسية من أرقى دور الأزياء والعلامات التجارية العالمية.'
            : 'Discover our premium, curated collection of designer eyewear, prescription frames, and luxury sunglasses from world-renowned brands.'
        }
        imageSrc={heroSetting?.image}
        breadcrumbs={breadcrumbs}
      />

      {/* Optical Boutique Overview */}
      <section className="bg-white py-14 md:py-20 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-surface-light border border-border/70 hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-5">
                <Glasses className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2">
                {isAr ? 'أحدث الموديلات العالمية' : 'Latest Global Collections'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? 'نوفر أحدث إصدارات دور الأزياء العالمية من الإطارات العصرية والكلاسيكية.'
                  : 'Direct access to the latest seasonal releases from premier international fashion labels.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-light border border-border/70 hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2">
                {isAr ? 'فحص نظر شامل ومتقدم' : 'Expert Vision Care'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? 'فحوصات نظر دقيقة بواسطة أحدث الأجهزة الطبية المتطورة تحت إشراف أخصائيين معتمدين.'
                  : 'Comprehensive visual acuity and refraction tests performed with high-precision optical technology.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-light border border-border/70 hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2">
                {isAr ? 'قص وتركيب العدسات بدقة' : 'Precision Lens Fitting'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? 'أجود أنواع العدسات الطبية متعددة البؤر ومقاومة الانعكاس والضوء الأزرق.'
                  : 'High-definition digital lenses including progressive, anti-reflective, and blue-light filtration.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-light border border-border/70 hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-surface-mint text-brand flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-dark mb-2">
                {isAr ? 'ضمان الأصالة 100%' : '100% Authentic Brands'}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {isAr
                  ? 'جميع الإطارات والنظارات معتمدة وأصلية مع الضمان الرسمي الكامل وخدمات ما بعد البيع.'
                  : 'Every frame is genuine and sourced through authorized distributors with complete warranty.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Grid Section */}
      <section className="bg-[#F8FAF9] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase mb-3 border border-brand-pale/30">
              {isAr ? 'شركاء الأناقة والجودة' : 'Designer Showcase'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
              {isAr
                ? 'علاماتنا التجارية المعتمدة'
                : 'Premier Eyewear Brands'}
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'نفتخر بتقديم تشكيلة واسعة ومختارة بعناية تلبي أرقى أذواقكم وتضمن الراحة والأناقة.'
                : 'We are proud to feature an extensive portfolio of 28+ leading eyewear labels for ladies, gentlemen, and youth.'}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
            {OPTICAL_BRANDS.map((brand, idx) => {
              const logoUrl = `/images/opticals/${brand.image}`;
              return (
                <div
                  key={idx}
                  className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] md:w-[calc(25%-1.125rem)] lg:w-[calc(20%-1.2rem)] xl:w-[calc(16.666%-1.25rem)] bg-white rounded-2xl p-4 border border-border/70 hover:border-brand-pale/80 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center group"
                >
                  <div className="relative w-full h-20 md:h-24 flex items-center justify-center overflow-hidden">
                    <Image
                      src={logoUrl}
                      alt={`${brand.name} Logo`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain p-2 md:p-3 transition-transform duration-500 ease-out group-hover:scale-110 mix-blend-multiply"
                    />
                  </div>
                  <span className="mt-2 text-xs font-semibold text-text-subtle group-hover:text-brand-dark transition-colors text-center line-clamp-1">
                    {brand.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        heading={
          isAr
            ? 'تفضل بزيارة مركز البصريات اليوم'
            : 'Visit Salamatek Optical Boutique Today'
        }
        subtext={
          isAr
            ? 'فريقنا المتخصص في خدمتكم لمساعدتكم في اختيار الإطار والعدسات الطبية الأنسب لكم.'
            : 'Our certified optometrists and styling advisors are ready to help you find your perfect pair.'
        }
        ctaLabel={t.common.bookNow}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}
