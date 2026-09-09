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

async function getDepartments() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/departments?active=true&limit=100`, {
      next: { revalidate: 60 },
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
  const depts = await getDepartments();
  return LOCALES.flatMap((locale) =>
    depts.map((dept: any) => ({ locale, slug: dept.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const depts = await getDepartments();
  const dept = depts.find((d: any) => d.slug === slug);
  if (!dept) return {};

  const t = getTranslations(locale as Locale);
  const name = dept.name[locale as Locale] || dept.name.en;
  const desc = dept.description?.[locale as Locale] || dept.description?.en || '';

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

export default async function DepartmentDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const depts = await getDepartments();
  const dept = depts.find((d: any) => d.slug === slug);
  if (!dept) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';

  const name = dept.name[typedLocale] || dept.name.en;
  const desc = dept.description?.[typedLocale] || dept.description?.en || '';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'الأقسام' : 'Departments', href: getLocalizedPath('/departments', typedLocale) },
    { label: name },
  ];

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'الأقسام الطبية' : 'Medical Departments'}
        heading={name}
        subtext={desc}
        breadcrumbs={breadcrumbs}
      />

      {/* ── Content placeholder ───────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Placeholder content card */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-mint flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-brand-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold font-serif text-text-base mb-3">
              {name}
            </h2>
            <p className="text-text-muted leading-relaxed mb-6">
              {desc}
            </p>
            <p className="text-xs text-text-subtle italic">
              {t.common.placeholder}
            </p>
          </div>
        </div>
      </section>

      {/* ── Related departments ───────────────────────────────────────────── */}
      <section className="bg-surface-mint py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-5">
            {isAr ? 'أقسام أخرى' : 'Other Departments'}
          </p>
          <div className="flex flex-wrap gap-3">
            {depts
              .filter((d: any) => d._id !== dept._id)
              .slice(0, 5)
              .map((d: any) => (
                <Link
                  key={d._id}
                  href={getLocalizedPath(`/departments/${d.slug}`, typedLocale)}
                  className="px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-text-base hover:border-brand-pale hover:bg-white hover:text-brand-dark transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium"
                >
                  {d.name[typedLocale] || d.name.en}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <CTASection 
        heading={isAr ? 'هل تبحث عن رعاية متخصصة؟' : 'Looking for specialized care?'}
        subtext={isAr ? 'احجز موعدك اليوم.' : 'Book your appointment today.'}
        ctaLabel={t.common.bookNow}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}
