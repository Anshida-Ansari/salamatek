import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { PageHero } from '@/components/shared/PageHero';
import { CTASection } from '@/components/shared/CTASection';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getDoctors() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/doctors?active=true&limit=100`, {
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
    title: t.pages.doctors.title,
    description: t.pages.doctors.description,
  };
}

export default async function DoctorsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const p = t.pages.doctors;
  
  const [doctors, heroSetting] = await Promise.all([
    getDoctors(),
    getPageHero('doctors')
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
          {doctors.length === 0 ? (
            <div className="text-center py-20 text-text-muted">
              {t.common.placeholder || 'No doctors found.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doc: any) => (
                <div
                  key={doc._id}
                  className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden hover:border-brand-pale hover:shadow-card-md transition-all duration-200"
                >
                  <div className="relative aspect-[4/5] bg-surface-mint w-full overflow-hidden">
                    {doc.image ? (
                      <Image
                        src={doc.image}
                        alt={doc.name[typedLocale] || doc.name.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-brand-medium">
                        <svg className="w-16 h-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 text-center">
                    <p className="text-sm font-semibold text-brand-medium mb-1 uppercase tracking-wider">
                      {doc.departmentId?.name?.[typedLocale] || doc.departmentId?.name?.en || 'General'}
                    </p>
                    <h3 className="text-xl font-serif font-bold text-text-base mb-2">
                      {doc.name[typedLocale] || doc.name.en}
                    </h3>
                    {doc.designation && (
                      <p className="text-text-muted text-sm mb-4">
                        {doc.designation[typedLocale] || doc.designation.en}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
