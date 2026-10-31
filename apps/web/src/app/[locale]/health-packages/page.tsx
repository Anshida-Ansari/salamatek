import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { PageHero } from '@/components/shared/PageHero';
import { getContactSettings, getWhatsAppLink } from '@/lib/contact';
import {
  CheckCircle2,
  Clock,
  Package as PackageIcon,
  Sparkles,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

interface HealthPackageItem {
  _id: string;
  title: { en: string; ar: string };
  slug: string;
  description: { en: string; ar: string };
  price?: string;
  includedItems?: { en: string[]; ar: string[] };
  validity?: { en: string; ar: string };
  image?: string;
  featured: boolean;
  active: boolean;
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
  } catch {
    return null;
  }
}

async function getHealthPackages(): Promise<HealthPackageItem[]> {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/health-packages?active=true&limit=100`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
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
  const isAr = typedLocale === 'ar';
  const t = getTranslations(typedLocale);
  const p = t.pages.healthPackages;

  const [heroSetting, packages, contactSettings] = await Promise.all([
    getPageHero('health-packages'),
    getHealthPackages(),
    getContactSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'الباقات والعروض' : 'Health Packages'}
        heading={heroSetting?.title?.[typedLocale] || p.title}
        subtext={heroSetting?.description?.[typedLocale] || p.description}
        imageSrc={heroSetting?.image || '/images/hero-packages.jpg'}
      />

      {/* ── 1. Dynamic Health Packages Grid ── */}
      {packages.length > 0 && (
        <section className="py-16 md:py-24 bg-[#F8FAF9]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <span className="inline-block px-3.5 py-1 rounded-full bg-brand-mint text-brand-dark text-xs font-bold tracking-widest uppercase mb-3 border border-brand-pale">
                {isAr ? 'عروض وباقات الفحص' : 'Exclusive Packages'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-dark tracking-tight">
                {isAr ? 'باقات الرعاية الصحية المتميزة' : 'Our Comprehensive Health Packages'}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
                {isAr
                  ? 'اختر الباقة الصحية المصممة لتلبية احتياجاتك واحتياجات أسرتك بأعلى معايير الجودة الطبية.'
                  : 'Choose from our specialized checkup packages designed to provide complete healthcare peace of mind.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {packages.map((pkg) => {
                const title = pkg.title?.[typedLocale] || pkg.title?.en || 'Health Package';
                const description = pkg.description?.[typedLocale] || pkg.description?.en || '';
                const included = pkg.includedItems?.[typedLocale] || pkg.includedItems?.en || [];
                const validity = pkg.validity?.[typedLocale] || pkg.validity?.en;

                const whatsappUrl = getWhatsAppLink(
                  contactSettings.whatsappNumber || '966532963521',
                  isAr
                    ? `مرحباً، أود الاستفسار وحجز باقة "${title}" في مجمع سلامتك الطبي.`
                    : `Hello, I would like to inquire about and book the "${title}" package at Salamatek Medical Centre.`
                );

                return (
                  <div
                    key={pkg._id}
                    className="relative bg-white rounded-3xl border border-border/70 overflow-hidden shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Featured Badge */}
                    {pkg.featured && (
                      <div className="absolute top-4 right-4 z-10 rtl:right-auto rtl:left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand text-white text-xs font-bold shadow-md">
                          <Sparkles className="w-3.5 h-3.5" />
                          {isAr ? 'باقة مميزة' : 'Featured'}
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Package Image */}
                      {pkg.image ? (
                        <div className="relative w-full aspect-[16/10] bg-gray-50 overflow-hidden border-b border-border/40">
                          <Image
                            src={pkg.image}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[16/9] bg-gradient-to-br from-surface-mint via-white to-surface-mint/30 flex items-center justify-center border-b border-border/40">
                          <div className="w-14 h-14 rounded-2xl bg-white text-brand flex items-center justify-center shadow-xs border border-brand-pale">
                            <PackageIcon className="w-7 h-7" />
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold font-serif text-brand-dark mb-2">
                          {title}
                        </h3>

                        {description && (
                          <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4">
                            {description}
                          </p>
                        )}

                        {/* Included Items */}
                        {included.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-border/50">
                            <p className="text-xs font-bold uppercase tracking-wider text-brand">
                              {isAr ? 'تشمل الباقة:' : 'Package Includes:'}
                            </p>
                            <ul className="space-y-1.5">
                              {included.slice(0, 5).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{item}</span>
                                </li>
                              ))}
                              {included.length > 5 && (
                                <li className="text-[11px] font-semibold text-brand-medium pt-0.5">
                                  +{included.length - 5} {isAr ? 'فحوصات وخدمات إضافية' : 'more included services'}
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Validity */}
                        {validity && (
                          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-4 pt-3 border-t border-border/40">
                            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{validity}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="p-6 pt-0 mt-auto">
                      <div className="flex items-baseline justify-between mb-4 pt-4 border-t border-border/50">
                        <span className="text-xs text-text-muted font-medium">
                          {isAr ? 'السعر' : 'Price'}
                        </span>
                        {pkg.price ? (
                          <span className="text-2xl font-bold font-serif text-brand-dark">
                            {pkg.price}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-brand">
                            {isAr ? 'تواصل للتسعير' : 'Contact for Price'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand hover:bg-brand-medium text-white font-semibold text-xs sm:text-sm transition shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span>{isAr ? 'حجز الباقة' : 'Book Package'}</span>
                        </a>

                        <a
                          href={isAr ? 'https://salamatekonline.com/ar/' : 'https://salamatekonline.com/en/'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-surface-mint hover:bg-brand-pale text-brand-dark border border-brand-pale transition cursor-pointer"
                          title={isAr ? 'شراء عبر سلامتك أونلاين' : 'Purchase on Salamatek Online'}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 2. Salamatek Online Promotional Booking Banner ── */}
      <section className="py-20 lg:py-28 relative bg-surface-mint/30 flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-light/5 pattern-dots" aria-hidden="true" />

        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#123f2f] rounded-3xl p-8 lg:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-start">
              <h2
                className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
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
                {typedLocale === 'ar' ? 'شراء الباقة' : 'Package Purchase'}
                <svg
                  className="ml-2 w-5 h-5 rtl:mr-2 rtl:ml-0 rtl:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
