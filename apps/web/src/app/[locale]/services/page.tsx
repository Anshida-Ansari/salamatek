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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/services?active=true&limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
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

// Minimal icon for service listing
function ServiceIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const p = t.pages.services;
  const services = await getServices();

  return (
    <>
      <PageHero 
        locale={typedLocale}
        badge={p.title}
        heading={p.title}
        subtext={p.description}
      />

      <section className="py-16 md:py-24 bg-surface-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s: any) => (
              <Link
                key={s._id}
                href={getLocalizedPath(`/services/${s.slug}`, typedLocale)}
                className="group flex flex-col bg-surface-white rounded-3xl shadow-card hover:shadow-card-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Visual Header */}
                <div className="h-32 bg-brand-mint relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-repeat" />
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-card flex items-center justify-center text-brand-medium relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <ServiceIcon />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-xl font-serif font-bold text-text-base mb-3 group-hover:text-brand-medium transition-colors">
                    {s.name[typedLocale] || s.name.en}
                  </h2>
                  <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {s.description?.[typedLocale] || s.description?.en || ''}
                  </p>
                  
                  <div className="flex items-center text-sm font-semibold text-brand-medium">
                    {t.common.learnMore}
                    <svg className="w-4 h-4 ms-2 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
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
