import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';

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

function ServiceIcon() {
  return (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const p = t.pages.services;
  const isAr = typedLocale === 'ar';

  const [services, categories, heroSetting] = await Promise.all([
    getServices(),
    getServiceCategories(),
    getPageHero('services'),
  ]);

  // Group services by category
  const categorizedGroups: {
    category: any;
    items: any[];
  }[] = [];

  const categoryMap = new Map<string, any[]>();
  const uncategorizedItems: any[] = [];

  services.forEach((service: any) => {
    const catId = service.categoryId?._id || service.categoryId;
    if (catId) {
      const idStr = catId.toString();
      if (!categoryMap.has(idStr)) {
        categoryMap.set(idStr, []);
      }
      categoryMap.get(idStr)!.push(service);
    } else {
      uncategorizedItems.push(service);
    }
  });

  // Keep categories in their defined sort order
  categories.forEach((cat: any) => {
    const items = categoryMap.get(cat._id.toString()) || [];
    if (items.length > 0) {
      categorizedGroups.push({
        category: cat,
        items,
      });
    }
  });

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-24">
          {/* Categorized Groups */}
          {categorizedGroups.map(({ category, items }, groupIdx) => {
            const catName = category.name?.[typedLocale] || category.name?.en;
            const catDesc =
              category.description?.[typedLocale] ||
              category.description?.en ||
              '';

            return (
              <div key={category._id} className="space-y-8">
                {/* Category Header */}
                <div className="border-b border-border/80 pb-5">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                    <div>
                      <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-medium mb-1.5">
                        {isAr ? `الفئة ${groupIdx + 1}` : `Category 0${groupIdx + 1}`}
                      </span>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-dark">
                        {catName}
                      </h2>
                    </div>
                    {catDesc && (
                      <p className="text-sm md:text-base text-text-muted max-w-xl">
                        {catDesc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((s: any) => {
                    const sName = s.name?.[typedLocale] || s.name?.en;
                    const sDesc =
                      s.description?.[typedLocale] || s.description?.en || '';
                    const orgs = Array.isArray(s.associatedOrganizations)
                      ? s.associatedOrganizations
                      : [];

                    return (
                      <Link
                        key={s._id}
                        href={getLocalizedPath(`/services/${s.slug}`, typedLocale)}
                        className="group flex flex-col bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden border border-border/60 hover:border-brand-pale/50"
                      >
                        {/* Visual Header */}
                        <div className="h-52 bg-surface-mint relative overflow-hidden flex items-center justify-center">
                          {s.image ? (
                            <img
                              src={s.image}
                              alt={sName}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-2xl bg-white shadow-card flex items-center justify-center text-brand-medium relative z-10 group-hover:scale-110 transition-transform duration-300">
                                <ServiceIcon />
                              </div>
                            </>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-7 sm:p-8 flex flex-col flex-1">
                          <h3 className="text-xl font-serif font-bold text-brand-dark mb-3 group-hover:text-brand transition-colors">
                            {sName}
                          </h3>

                          {sDesc && (
                            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                              {sDesc}
                            </p>
                          )}

                          {/* Associated Organizations (e.g. for Pre-Employment Medical) */}
                          {orgs.length > 0 && (
                            <div className="mb-6 pt-4 border-t border-border/60">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-text-subtle mb-2.5">
                                {isAr
                                  ? 'معتمد لدى كبرى المنشآت الصناعية:'
                                  : 'Approved for Industrial Organizations:'}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {orgs.map((org: string, i: number) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-2.5 py-1 bg-surface-mint/80 rounded-lg text-brand-dark font-bold text-xs border border-brand-pale/40 tracking-wide"
                                  >
                                    {org}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-auto pt-2 flex items-center text-sm font-semibold text-brand group-hover:text-brand-medium transition-colors">
                            <span>{t.common.learnMore}</span>
                            <svg
                              className="w-4 h-4 ms-2 rtl:rotate-180 transition-transform group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Uncategorized Services (Fallback) */}
          {uncategorizedItems.length > 0 && (
            <div className="space-y-8 pt-8">
              <div className="border-b border-border/80 pb-5">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">
                  {isAr ? 'خدمات طبية إضافية' : 'Additional Healthcare Services'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {uncategorizedItems.map((s: any) => (
                  <Link
                    key={s._id}
                    href={getLocalizedPath(`/services/${s.slug}`, typedLocale)}
                    className="group flex flex-col bg-white rounded-3xl shadow-card hover:shadow-card-md transition-shadow duration-300 overflow-hidden border border-border/60"
                  >
                    <div className="h-48 bg-surface-mint relative overflow-hidden flex items-center justify-center">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name?.[typedLocale] || s.name?.en}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-card flex items-center justify-center text-brand-medium">
                          <ServiceIcon />
                        </div>
                      )}
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <h3 className="text-xl font-serif font-bold text-text-base mb-3 group-hover:text-brand-medium transition-colors">
                        {s.name?.[typedLocale] || s.name?.en}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                        {s.description?.[typedLocale] || s.description?.en || ''}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-brand-medium">
                        {t.common.learnMore}
                        <svg
                          className="w-4 h-4 ms-2 rtl:rotate-180 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Digital Integration & Certification Section ─────────────────────── */}
      <section className="bg-brand-dark text-white py-16 md:py-24 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-medium/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-light border border-white/15 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {isAr ? 'اعتماد وتكامل حكومي فوري' : 'Government Accredited & Integrated'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              {isAr
                ? 'التكامل والاعتماد الرقمي'
                : 'Digital Integration & Certification'}
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              {isAr
                ? 'خدماتنا الطبية معتمدة ومتكاملة رقمياً وبشكل فوري مع المنصات والأنظمة الحكومية السعودية الرسمية.'
                : 'Our medical services are fully integrated with Saudi government digital platforms.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Sehhaty System */}
            <div className="bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {isAr ? 'منصة صحتي' : 'Sehhaty System'}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {isAr
                    ? 'ربط مباشر لشهادات اللياقة وفحوصات الإقامة الرسمية (إفادة) واعتمادها الفوري لدى وزارة الصحة السعودية.'
                    : 'Direct synchronization for official medical fitness certifications and residency health reports with the Saudi Ministry of Health.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {isAr ? 'تكامل رقمي فوري' : 'Live Electronic Sync'}
              </div>
            </div>

            {/* Moroor System */}
            <div className="bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.375c0-.621-.504-1.125-1.125-1.125h-9.75c-.621 0-1.125.504-1.125 1.125v10.875m12 0H3.375"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {isAr ? 'نظام المرور' : 'Moroor System'}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {isAr
                    ? 'تسجيل وإرسال نتائج فحص رخص القيادة وقياس النظر إلكترونياً وبشكل فوري للإدارة العامة للمرور.'
                    : 'Electronic registration and instant submission of driving license medical exams and eye tests to the General Directorate of Traffic.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {isAr ? 'ربط آلي معتمد' : 'Authorized Gateway'}
              </div>
            </div>

            {/* Absher Portal */}
            <div className="bg-white/[0.07] hover:bg-white/[0.11] border border-white/15 rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  {isAr ? 'منصة أبشر' : 'Absher Portal'}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {isAr
                    ? 'توثيق رسمي وتأكيد رقمي مؤمّن لنتائج الفحوصات الطبية عبر البوابة الوطنية الموحدة لتسهيل الإجراءات الحكومية.'
                    : 'Secure governmental authentication of verified medical records through the unified national portal for streamlined citizen and resident procedures.'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {isAr ? 'توثيق حكومي رسمي' : 'National Portal Integration'}
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
