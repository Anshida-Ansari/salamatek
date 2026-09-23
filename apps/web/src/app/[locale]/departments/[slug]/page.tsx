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
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
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

async function getDepartmentServices(departmentId: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/services?active=true&departmentId=${departmentId}&limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

async function getDepartmentDoctors(departmentId: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/doctors?active=true&departmentId=${departmentId}&limit=50`, {
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
  const subheading = dept.subheading?.[typedLocale] || dept.subheading?.en || '';
  const desc = dept.description?.[typedLocale] || dept.description?.en || '';

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: getLocalizedPath('/', typedLocale) },
    { label: isAr ? 'الأقسام' : 'Departments', href: getLocalizedPath('/departments', typedLocale) },
    { label: name },
  ];

  const [services, doctors] = await Promise.all([
    getDepartmentServices(dept._id),
    getDepartmentDoctors(dept._id)
  ]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHero
        locale={typedLocale}
        badge={isAr ? 'الأقسام الطبية' : 'Medical Departments'}
        heading={name}
        breadcrumbs={breadcrumbs}
        imageSrc={dept.image}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-28">
          
          {/* Department Overview: Elegant Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-4 flex flex-col items-start space-y-4">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-surface-mint/50 text-brand-dark text-xs font-bold tracking-widest uppercase">
                {isAr ? 'عن القسم' : 'About Department'}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-dark leading-tight relative">
                {name}
                <div className="absolute -bottom-3 start-0 w-12 h-1 bg-brand rounded-full"></div>
              </h2>
            </div>
            
            <div className="lg:col-span-8 space-y-6 lg:pt-4">
              {subheading && (
                <p className="text-xl md:text-2xl italic font-serif text-brand font-medium leading-relaxed border-s-4 border-brand-pale ps-5 py-2">
                  {subheading}
                </p>
              )}
              {desc && (
                <div className="prose prose-lg max-w-none text-text-muted">
                  <p className="leading-relaxed whitespace-pre-line text-base md:text-lg">
                    {desc}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Services Section */}
          {services.length > 0 && (
            <div className="border-t border-border/50 pt-16">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-8 rounded-full bg-surface-mint flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 rounded-full bg-brand-medium"></div>
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">
                  {isAr ? 'الخدمات المتوفرة' : 'Available Services'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <Link
                    key={service._id}
                    href={getLocalizedPath(`/services/${service.slug}`, typedLocale)}
                    className="group bg-white p-6 rounded-2xl border border-border hover:border-brand hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 end-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-brand">
                      <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-3 pe-8 group-hover:text-brand transition-colors">
                      {service.name[typedLocale] || service.name.en}
                    </h3>
                    <p className="text-base text-text-muted leading-relaxed line-clamp-3">
                      {service.description?.[typedLocale] || service.description?.en || ''}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Doctors Section */}
          {doctors.length > 0 && (
            <div className="border-t border-border/50 pt-16">
              <div className="text-center mb-12">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-medium mb-3">
                  {isAr ? 'الخبراء' : 'The Experts'}
                </p>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">
                  {isAr ? 'أطباؤنا' : 'Our Doctors'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {doctors.map((doc: any) => (
                  <div key={doc._id} className="group h-full flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-transparent hover:border-border/60">
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
                        <Link 
                          href={getLocalizedPath(`/doctors`, typedLocale)}
                          className="block w-full py-2.5 bg-white text-brand-dark text-sm font-semibold rounded-xl text-center hover:bg-brand hover:text-white transition-colors"
                        >
                          {isAr ? 'عرض الملف الشخصي' : 'View Profile'}
                        </Link>
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
                            <span>{doc.experienceYears}+ {isAr ? 'سنوات خبرة' : 'Years Experience'}</span>
                          </div>
                        ) : (
                          <div className="h-[30px]"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {services.length === 0 && doctors.length === 0 && (
            <div className="bg-surface-mint/20 rounded-3xl p-10 text-center max-w-2xl mx-auto border border-brand-pale/30">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm text-brand">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base md:text-lg text-brand-dark leading-relaxed font-medium">
                {isAr 
                  ? 'لمزيد من المعلومات حول خدمات وأطباء هذا القسم، يرجى التواصل مع فريق الاستقبال أو حجز موعد استشارة.' 
                  : 'For more information regarding specialized services and consultations in this department, please contact our reception or book an appointment.'}
              </p>
            </div>
          )}
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
