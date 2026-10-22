import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from '@/i18n';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';
import { User, ArrowRight } from 'lucide-react';

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
  const isAr = typedLocale === 'ar';
  const doctors = await getDoctors();

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      {/* ── 1. Clean Healthcare-Themed Banner (No doctor photo in background) ── */}
      <section className="relative bg-gradient-to-br from-brand-dark via-[#0C3528] to-[#08221A] text-white pt-24 pb-14 md:pt-28 md:pb-20 overflow-hidden">
        {/* Subtle decorative glow accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-light/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-start">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center justify-center sm:justify-start gap-2 text-xs text-brand-pale/75" aria-label="Breadcrumbs">
            <Link href={getLocalizedPath('/', typedLocale)} className="hover:text-white transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{isAr ? 'أطباؤنا' : 'Our Doctors'}</span>
          </nav>

          <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-brand-pale text-xs font-semibold tracking-wider uppercase mb-3 border border-white/10">
            {isAr ? 'فريق الرعاية الطبية المتخصص' : 'Specialist Healthcare Team'}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            {isAr ? 'أطباؤنا ومتخصصونا' : 'Our Doctors & Specialists'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-brand-pale/80 leading-relaxed mx-auto sm:mx-0">
            {isAr
              ? 'نخبة من الأطباء والاستشاريين المتخصصين لتقديم رعاية صحية متكاملة لجميع أفراد الأسرة.'
              : 'Our dedicated team of consultants and specialists providing compassionate, patient-centered medical care.'}
          </p>
        </div>
      </section>

      {/* ── 2. Doctor Directory Grid ────────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {doctors.length === 0 ? (
            <div className="text-center py-20 text-text-muted bg-white rounded-3xl border border-border/70 p-8 max-w-md mx-auto">
              <p className="text-base font-semibold text-brand-dark mb-1">
                {isAr ? 'لا يوجد أطباء حالياً' : 'No doctors found'}
              </p>
              <p className="text-xs text-text-muted">
                {isAr ? 'يرجى التحقق مرة أخرى قريباً.' : 'Please check back soon.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {doctors.map((doc: any) => {
                const docName = doc.name[typedLocale] || doc.name.en;
                const docDesignation = doc.designation?.[typedLocale] || doc.designation?.en;
                const deptName = doc.departmentId?.name?.[typedLocale] || doc.departmentId?.name?.en;
                const docNat = doc.nationality?.[typedLocale] || doc.nationality?.en;
                const hasExp = typeof doc.experienceYears === 'number' && doc.experienceYears > 0;

                return (
                  <div
                    key={doc._id}
                    className="bg-white rounded-3xl overflow-hidden border border-border/80 shadow-xs hover:shadow-card hover:border-brand/30 transition-all duration-300 flex flex-col"
                  >
                    {/* Doctor Portrait Container */}
                    <div className="relative aspect-[4/5] bg-surface-mint/30 w-full overflow-hidden shrink-0">
                      {doc.image ? (
                        <Image
                          src={doc.image}
                          alt={docName}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-pale">
                          <User className="w-20 h-20" />
                        </div>
                      )}

                      {/* Department Tag */}
                      {deptName && (
                        <div className="absolute top-3.5 start-3.5 z-10">
                          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-brand-dark/85 text-white backdrop-blur-md border border-white/20 shadow-xs">
                            {deptName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="p-6 flex flex-col flex-1 text-center sm:text-start">
                      <Link
                        href={getLocalizedPath(`/doctors/${doc.slug}`, typedLocale)}
                        className="group"
                      >
                        <h2 className="text-xl font-serif font-bold text-brand-dark group-hover:text-brand transition-colors line-clamp-1">
                          {docName}
                        </h2>
                      </Link>

                      {docDesignation && (
                        <p className="text-xs sm:text-sm text-text-muted font-medium mt-1 line-clamp-1">
                          {docDesignation}
                        </p>
                      )}

                      {/* Admin-Provided Meta Badges (Only if present!) */}
                      {(hasExp || docNat) && (
                        <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          {hasExp && (
                            <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-surface-mint text-brand-dark border border-brand/15">
                              {doc.experienceYears}+ {isAr ? 'سنوات خبرة' : 'Years Experience'}
                            </span>
                          )}
                          {docNat && (
                            <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-text-muted">
                              {docNat}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Action Button: View Profile */}
                      <div className="mt-auto pt-5 border-t border-border/60">
                        <Link
                          href={getLocalizedPath(`/doctors/${doc.slug}`, typedLocale)}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-surface-mint hover:text-brand-dark text-brand-dark text-xs sm:text-sm font-semibold transition-colors"
                        >
                          <span>{isAr ? 'عرض الملف الشخصي' : 'View Profile'}</span>
                          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
