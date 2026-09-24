import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { PageHero } from '@/components/shared/PageHero';

type Props = {
  params: Promise<{ locale: string }>;
};

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
  
  const heroSetting = await getPageHero('packages');

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        locale={typedLocale}
        badge="Health Packages"
        heading={heroSetting?.title?.[typedLocale] || p.title}
        subtext={heroSetting?.description?.[typedLocale] || p.description}
        imageSrc={heroSetting?.imageUrl || '/images/hero-packages.jpg'}
      />

      <section className="py-20 lg:py-32 relative bg-surface-mint/30 flex-1 flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-light/5 pattern-dots" aria-hidden="true" />
        
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="bg-[#123f2f] rounded-3xl p-8 lg:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="flex-1 text-center md:text-start">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                {typedLocale === 'ar' ? 'اكتشف المزيد على سلامتك أونلاين' : 'Discover More on Salamatek Online'}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                {typedLocale === 'ar' 
                  ? 'احجز مواعيدك بسهولة واستكشف خدماتنا الطبية الشاملة من خلال منصتنا الإلكترونية المتكاملة.' 
                  : 'Book appointments effortlessly and explore our comprehensive medical services through our integrated online platform.'}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <a 
                href={typedLocale === 'ar' ? 'https://salamatekonline.com/ar/' : 'https://salamatekonline.com/en/'}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 text-base font-bold text-[#123f2f] shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#123f2f]"
              >
                {typedLocale === 'ar' ? 'الذهاب للمنصة' : 'Go to Platform'}
                <svg className="ml-2 w-5 h-5 rtl:mr-2 rtl:ml-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

          </div>
          
        </div>
      </section>

    </div>
  );
}
