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
        subtext={subheading || desc}
        breadcrumbs={breadcrumbs}
        imageSrc={dept.image}
      />

      <section className="bg-surface-light py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Department Overview: Title, Italic Subheading, Description */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 border border-border shadow-card space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-surface-mint text-brand-dark text-xs font-bold tracking-wider uppercase">
              {isAr ? 'عن القسم' : 'About Department'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-brand-dark tracking-tight uppercase">
              {name}
            </h2>
            {subheading && (
              <p className="text-lg sm:text-xl italic font-serif text-brand font-medium leading-relaxed border-s-4 border-brand ps-4 py-1">
                {subheading}
              </p>
            )}
            {desc && (
              <p className="text-base sm:text-lg text-text-muted leading-relaxed whitespace-pre-line pt-2">
                {desc}
              </p>
            )}
          </div>
          
          {/* Services Section */}
          {services.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-text-base mb-8">
                {isAr ? 'الخدمات المتوفرة' : 'Available Services'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <Link
                    key={service._id}
                    href={getLocalizedPath(`/services/${service.slug}`, typedLocale)}
                    className="group bg-white p-6 rounded-2xl border border-border hover:border-brand-pale hover:shadow-card-sm transition-all duration-200"
                  >
                    <h3 className="text-lg font-bold text-text-base mb-2 group-hover:text-brand-medium transition-colors">
                      {service.name[typedLocale] || service.name.en}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {service.description?.[typedLocale] || service.description?.en || ''}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Doctors Section */}
          {doctors.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-text-base mb-8">
                {isAr ? 'أطباؤنا' : 'Our Doctors'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doc: any) => (
                  <div key={doc._id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                    {doc.image && (
                      <div className="relative aspect-[4/5] bg-surface-mint w-full">
                        <img src={doc.image} alt={doc.name[typedLocale] || doc.name.en} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-serif font-bold text-text-base mb-1">
                        {doc.name[typedLocale] || doc.name.en}
                      </h3>
                      {doc.designation && (
                        <p className="text-sm text-brand-medium font-semibold">
                          {doc.designation[typedLocale] || doc.designation.en}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {services.length === 0 && doctors.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-border max-w-lg mx-auto">
              <p className="text-sm text-text-muted leading-relaxed">
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
