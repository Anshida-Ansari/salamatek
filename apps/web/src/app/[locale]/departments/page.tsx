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

async function getPageHero(pageKey: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
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
    title: t.pages.departments.title,
    description: t.pages.departments.description,
    openGraph: {
      title: t.pages.departments.title,
      description: t.pages.departments.description,
    },
  };
}

export default async function DepartmentsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const p = t.pages.departments;
  
  const [depts, heroSetting] = await Promise.all([
    getDepartments(),
    getPageHero('departments')
  ]);

  const heading = heroSetting?.heading?.[typedLocale] || p.title;
  const subtext = heroSetting?.subtext?.[typedLocale] || p.description;

  return (
    <>
      <PageHero 
        locale={typedLocale}
        badge={p.title}
        heading={heading}
        subtext={subtext}
        imageSrc={heroSetting?.image}
      />

      <section className="py-16 md:py-24 bg-surface-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {depts.map((d: any) => (
              <Link
                key={d._id}
                href={getLocalizedPath(`/departments/${d.slug}`, typedLocale)}
                className="group flex flex-col bg-white border border-border rounded-2xl p-6 hover:border-brand-pale hover:shadow-card-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium"
                aria-label={`${d.name[typedLocale] || d.name.en} — ${d.description?.[typedLocale] || d.description?.en || ''}`}
              >
                {/* Icon Placeholder */}
                <div className="w-11 h-11 rounded-xl bg-brand-mint flex items-center justify-center text-brand-medium mb-5 group-hover:bg-brand-medium group-hover:text-white transition-colors duration-200">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>

                {/* Name */}
                <h3 className="text-xl font-serif font-bold text-text-base mb-3 group-hover:text-brand-medium transition-colors">
                  {d.name[typedLocale] || d.name.en}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {d.description?.[typedLocale] || d.description?.en || ''}
                </p>
                
                <div className="flex items-center text-sm font-semibold text-brand-medium">
                  {t.common.learnMore}
                  <svg className="w-4 h-4 ms-2 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            ))}
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
