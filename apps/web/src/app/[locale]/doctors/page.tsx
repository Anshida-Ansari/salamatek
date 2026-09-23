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

async function getDoctors() {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
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
          {doctors.length === 0 ? (
            <div className="text-center py-20 text-text-muted">
              {t.common.placeholder || 'No doctors found.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doc: any) => (
                <Link
                  href={getLocalizedPath(`/doctors/${doc.slug}`, typedLocale)}
                  key={doc._id}
                  className="group h-full flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-transparent hover:border-border/60"
                >
                  <div className="relative aspect-[4/5] bg-surface-light w-full overflow-hidden shrink-0">
                    {doc.image ? (
                      <img
                        src={doc.image}
                        alt={doc.name[typedLocale] || doc.name.en}
                        className="object-cover w-full h-full object-top group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-mint/30">
                        <svg className="w-20 h-20 text-brand-pale" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute bottom-0 start-0 end-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div 
                        className="block w-full py-2.5 bg-white text-brand-dark text-sm font-semibold rounded-xl text-center cursor-default shadow-sm"
                      >
                        {doc.departmentId?.name?.[typedLocale] || doc.departmentId?.name?.en || 'Specialist'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 text-center bg-white relative z-10 flex flex-col items-center flex-grow">
                    <h3 className="text-xl lg:text-2xl font-serif font-bold text-brand-dark mb-1.5 group-hover:text-brand transition-colors">
                      {doc.name[typedLocale] || doc.name.en}
                    </h3>
                    {doc.designation && (
                      <p className="text-sm md:text-base text-text-muted font-medium mb-4">
                        {doc.designation[typedLocale] || doc.designation.en}
                      </p>
                    )}
                    
                    <div className="mt-auto pt-2">
                      {doc.experienceYears ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-mint rounded-full text-brand-dark font-bold text-sm border border-brand-pale/30">
                          <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span>{doc.experienceYears}+ {typedLocale === 'ar' ? 'سنوات خبرة' : 'Years Experience'}</span>
                        </div>
                      ) : (
                        <div className="h-[30px]"></div>
                      )}
                    </div>
                  </div>
                </Link>
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
