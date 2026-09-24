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
      next: { revalidate: 60 },
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
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-border/60 shadow-sm max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-brand-mint/30 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">
                {typedLocale === 'ar' ? 'باقات صحية جديدة قريباً' : 'New Health Packages Coming Soon'}
              </h3>
              <p className="text-text-muted mb-8 max-w-md leading-relaxed">
                {typedLocale === 'ar' 
                  ? 'نعمل حالياً على تصميم باقات صحية حصرية تناسب احتياجاتكم. يرجى زيارة بوابتنا الإلكترونية للحصول على المزيد من الخدمات.'
                  : 'We are currently designing exclusive new health packages. Please visit our online booking portal for our complete range of services.'}
              </p>
              <a 
                href="https://salamatekonline.com/en/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand hover:bg-brand-medium text-white font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group"
              >
                {typedLocale === 'ar' ? 'زيارة سلامتك أونلاين' : 'Visit Salamatek Online'}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
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

          {/* Salamatek Online Promo Section */}
          <div className="mt-20 bg-brand-dark rounded-3xl overflow-hidden relative shadow-xl">
            <div className="absolute inset-0 bg-brand/20"></div>
            <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 px-8 py-12 md:py-16 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center md:text-start">
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4">
                  {typedLocale === 'ar' ? 'اكتشف المزيد على سلامتك أونلاين' : 'Discover More on Salamatek Online'}
                </h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  {typedLocale === 'ar' 
                    ? 'احجز مواعيدك بكل سهولة وتعرف على خدماتنا الطبية الشاملة عبر منصتنا الإلكترونية المتكاملة.'
                    : 'Book appointments effortlessly and explore our comprehensive medical services through our integrated online platform.'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <a 
                  href="https://salamatekonline.com/en/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-dark hover:bg-brand-pale hover:text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  {typedLocale === 'ar' ? 'انتقل إلى المنصة' : 'Go to Platform'}
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
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
