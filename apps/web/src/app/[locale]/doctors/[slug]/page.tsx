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

async function getDoctors() {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/doctors?active=true&limit=200`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return LOCALES.flatMap((locale) =>
    doctors.map((doc: any) => ({ locale, slug: doc.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const doctors = await getDoctors();
  const doc = doctors.find((d: any) => d.slug === slug);
  if (!doc) return {};

  const t = getTranslations(locale as Locale);
  const name = doc.name[locale as Locale] || doc.name.en;
  const designation = doc.designation?.[locale as Locale] || doc.designation?.en || '';

  return {
    title: `${name} - ${designation} — ${t.meta.siteName}`,
    description: doc.bio?.[locale as Locale] || doc.bio?.en || '',
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const doctors = await getDoctors();
  const doc = doctors.find((d: any) => d.slug === slug);
  if (!doc) notFound();

  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === 'ar';

  const name = doc.name[typedLocale] || doc.name.en;
  const designation = doc.designation?.[typedLocale] || doc.designation?.en;
  const departmentName = doc.departmentId?.name?.[typedLocale] || doc.departmentId?.name?.en;
  const departmentSlug = doc.departmentId?.slug;
  const bio = doc.bio?.[typedLocale] || doc.bio?.en;
  const specialization = doc.specialization?.[typedLocale] || doc.specialization?.en;
  const qualification = doc.qualification?.[typedLocale] || doc.qualification?.en;
  const languages = doc.languages?.[typedLocale] || doc.languages?.en || [];

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'أطباؤنا' : 'Our Doctors', href: getLocalizedPath('/doctors', typedLocale) },
    { label: name },
  ];

  return (
    <>
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'الملف الشخصي للطبيب' : 'Doctor Profile'}
        heading={name}
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-surface-light py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50">
            <div className="flex flex-col md:flex-row">
              
              {/* Image Side */}
              <div className="w-full md:w-5/12 lg:w-4/12 relative aspect-[3/4] md:aspect-auto bg-surface-mint shrink-0">
                {doc.image ? (
                  <img 
                    src={doc.image} 
                    alt={name} 
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-brand-pale opacity-50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-7/12 lg:w-8/12 p-8 lg:p-12 flex flex-col">
                <div className="mb-6">
                  {departmentName && (
                    <Link 
                      href={getLocalizedPath(`/departments/${departmentSlug}`, typedLocale)}
                      className="inline-block px-3 py-1 rounded-full bg-surface-mint/80 text-brand-dark hover:text-brand transition-colors text-xs font-bold tracking-widest uppercase mb-4"
                    >
                      {departmentName}
                    </Link>
                  )}
                  <h1 className="text-3xl lg:text-4xl font-serif font-bold text-brand-dark mb-2">
                    {name}
                  </h1>
                  {designation && (
                    <p className="text-lg text-brand-medium font-medium">
                      {designation}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 py-6 border-y border-border/60">
                  {doc.experienceYears && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-1">
                        {isAr ? 'الخبرة' : 'Experience'}
                      </p>
                      <p className="text-brand-dark font-medium">
                        {doc.experienceYears}+ {isAr ? 'سنوات' : 'Years'}
                      </p>
                    </div>
                  )}
                  
                  {languages.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-1">
                        {isAr ? 'اللغات' : 'Languages'}
                      </p>
                      <p className="text-brand-dark font-medium">
                        {languages.join(', ')}
                      </p>
                    </div>
                  )}

                  {specialization && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-1">
                        {isAr ? 'التخصص الدقيق' : 'Specialization'}
                      </p>
                      <p className="text-brand-dark font-medium">
                        {specialization}
                      </p>
                    </div>
                  )}
                  
                  {qualification && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-1">
                        {isAr ? 'المؤهلات العلمية' : 'Qualifications'}
                      </p>
                      <p className="text-brand-dark font-medium">
                        {qualification}
                      </p>
                    </div>
                  )}
                </div>

                {bio && (
                  <div className="mt-auto">
                    <p className="text-xs font-bold uppercase tracking-widest text-text-subtle mb-3">
                      {isAr ? 'نبذة عن الطبيب' : 'About Doctor'}
                    </p>
                    <p className="text-text-muted leading-relaxed whitespace-pre-line">
                      {bio}
                    </p>
                  </div>
                )}
                
              </div>
            </div>
          </div>

        </div>
      </section>

      <CTASection 
        heading={isAr ? 'احجز موعدك الآن' : 'Book an Appointment'}
        subtext={isAr ? `احصل على استشارة مع ${name}` : `Consult with ${name}`}
        ctaLabel={t.common.bookNow}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
      />
    </>
  );
}
