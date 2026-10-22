import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { contactConfig } from '@/config/contact';
import { Stethoscope, User, MessageCircle } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

interface DutySection {
  heading: string;
  items: string[];
}

/**
 * Intelligent parser that sanitizes control characters (like \u0001 from MS Word),
 * and structures headings and items cleanly without awkward empty gaps.
 */
function parseClinicalDuties(text?: string): DutySection[] {
  if (!text) return [];
  const cleaned = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  if (!cleaned) return [];

  const rawLines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: DutySection[] = [];
  let current: DutySection | null = null;

  for (const rawLine of rawLines) {
    const isSub = /^[oO\-\*]\s*/.test(rawLine);
    const isMain = /^[•\u2022\u25CF\u25A0▪]\s*/.test(rawLine);

    if (isMain) {
      const heading = rawLine.replace(/^[•\u2022\u25CF\u25A0▪]\s*/, '').trim();
      current = { heading, items: [] };
      sections.push(current);
    } else if (isSub) {
      const item = rawLine.replace(/^[oO\-\*\u25E6\u2022\u25AA]\s*/, '').trim();
      if (!current) {
        current = { heading: '', items: [] };
        sections.push(current);
      }
      current.items.push(item);
    } else {
      if (!current) {
        current = { heading: rawLine, items: [] };
        sections.push(current);
      } else {
        current.items.push(rawLine);
      }
    }
  }

  return sections;
}

/**
 * Parses slash-delimited or multi-line remarks into clean bullet points.
 */
function parseRemarks(text?: string): string[] {
  if (!text) return [];
  const cleaned = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  if (!cleaned) return [];

  let items: string[] = [];
  if (cleaned.includes('/')) {
    items = cleaned.split('/').map((s) => s.trim()).filter(Boolean);
  } else if (cleaned.includes('\n')) {
    items = cleaned.split('\n').map((s) => s.replace(/^[-•*oO]\s*/, '').trim()).filter(Boolean);
  } else {
    items = [cleaned];
  }

  return items.map((item) => {
    if (!item) return '';
    return item.charAt(0).toUpperCase() + item.slice(1);
  });
}

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
    title: `${name} — ${designation} | ${t.meta.siteName}`,
    description: doc.bio?.[locale as Locale] || doc.bio?.en || `${name} - ${designation} at Salamatek Medical Center.`,
  };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const doctors = await getDoctors();
  const doc = doctors.find((d: any) => d.slug === slug);
  if (!doc) notFound();

  const typedLocale = locale as Locale;
  const isAr = typedLocale === 'ar';

  const name = doc.name[typedLocale] || doc.name.en;
  const designation = doc.designation?.[typedLocale] || doc.designation?.en;
  const departmentName = doc.departmentId?.name?.[typedLocale] || doc.departmentId?.name?.en;
  const departmentSlug = doc.departmentId?.slug;
  const bio = doc.bio?.[typedLocale] || doc.bio?.en;
  const specialization = doc.specialization?.[typedLocale] || doc.specialization?.en;
  const qualification = doc.qualification?.[typedLocale] || doc.qualification?.en;
  const languages: string[] = doc.languages?.[typedLocale] || doc.languages?.en || [];
  const nationality = doc.nationality?.[typedLocale] || doc.nationality?.en;
  const rawDuties = doc.clinicalDuties?.[typedLocale] || doc.clinicalDuties?.en;
  const rawRemarks = doc.remarks?.[typedLocale] || doc.remarks?.en;

  const parsedDuties = parseClinicalDuties(rawDuties);
  const parsedRemarks = parseRemarks(rawRemarks);

  // Check admin-provided fields (show only if admin entered data)
  const hasExperience = typeof doc.experienceYears === 'number' && doc.experienceYears > 0;
  const hasNationality = Boolean(nationality && nationality.trim());
  const hasLanguages = Array.isArray(languages) && languages.length > 0;
  const hasBio = Boolean(bio && bio.trim());
  const hasSpecialization = Boolean(specialization && specialization.trim());
  const hasQualification = Boolean(qualification && qualification.trim());
  const hasDuties = parsedDuties.length > 0;
  const hasRemarks = parsedRemarks.length > 0;

  // WhatsApp appointment target: use doctor-specific WhatsApp if configured by admin, else default clinic WhatsApp
  const rawWa = (doc.whatsapp && String(doc.whatsapp).trim()) || contactConfig.whatsappNumber;
  const cleanWa = rawWa.replace(/[^0-9]/g, '');
  const waMessage = isAr
    ? `السلام عليكم، أود حجز موعد مع ${name}`
    : `Hello, I would like to book an appointment with ${name}`;
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      {/* ── 1. Clean Healthcare-Themed Banner (No doctor photo in background) ── */}
      <section className="relative bg-gradient-to-br from-brand-dark via-[#0C3528] to-[#08221A] text-white pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-light/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-brand-pale/75" aria-label="Breadcrumbs">
            <Link href={getLocalizedPath('/', typedLocale)} className="hover:text-white transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <span>/</span>
            <Link href={getLocalizedPath('/doctors', typedLocale)} className="hover:text-white transition-colors">
              {isAr ? 'أطباؤنا' : 'Our Doctors'}
            </Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-xs">{name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              {departmentName && (
                <Link
                  href={getLocalizedPath(`/departments/${departmentSlug}`, typedLocale)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-brand-pale border border-white/15 text-xs font-semibold tracking-wider uppercase transition-colors mb-3"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-brand-light" />
                  <span>{departmentName}</span>
                </Link>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
                {name}
              </h1>
              {designation && (
                <p className="text-base sm:text-lg text-brand-pale mt-1.5 font-medium">
                  {designation}
                </p>
              )}
            </div>

            {/* Prominent WhatsApp Action (No contact numbers displayed as text) */}
            <div className="shrink-0">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand hover:bg-brand-medium text-white text-sm font-semibold transition-all shadow-md shadow-brand/20 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-brand-light" />
                <span>{isAr ? 'استشارة الطبيب' : 'Consult Doctor'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Doctor Information Layout (Admin-Provided Data Only) ───────── */}
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Doctor Portrait & Basic Metadata (4 cols) */}
            <div className="md:col-span-5 lg:col-span-4 space-y-5">
              <div className="bg-white rounded-3xl p-5 border border-border/80 shadow-xs">
                {/* Doctor Portrait */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-surface-mint border border-border/50">
                  {doc.image ? (
                    <Image
                      src={doc.image}
                      alt={name}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      priority
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-pale">
                      <User className="w-20 h-20" />
                    </div>
                  )}
                </div>

                {/* Only Admin-Entered Metadata */}
                {(hasExperience || hasNationality || hasLanguages) && (
                  <div className="mt-5 pt-4 border-t border-border/60 space-y-2.5 text-xs">
                    {hasExperience && (
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">{isAr ? 'سنوات الخبرة:' : 'Experience:'}</span>
                        <span className="font-semibold text-brand-dark tabular-nums">
                          {doc.experienceYears}+ {isAr ? 'سنوات' : 'Years'}
                        </span>
                      </div>
                    )}
                    {hasNationality && (
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">{isAr ? 'الجنسية:' : 'Nationality:'}</span>
                        <span className="font-semibold text-brand-dark">{nationality}</span>
                      </div>
                    )}
                    {hasLanguages && (
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">{isAr ? 'اللغات:' : 'Languages:'}</span>
                        <span className="font-semibold text-brand-dark">{languages.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* WhatsApp Action Button (Direct Chat, No displayed numbers) */}
                <div className="mt-5 pt-4 border-t border-border/60">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand hover:bg-brand-medium text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-brand-light" />
                    <span>{isAr ? 'طلب موعد استشارة' : 'Request Appointment'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Only Admin-Entered Clinical Details (8 cols) */}
            <div className="md:col-span-7 lg:col-span-8 space-y-6">

              {/* Bio / About (Only if admin provided) */}
              {hasBio && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs">
                  <h2 className="text-lg font-serif font-bold text-brand-dark mb-3">
                    {isAr ? 'نبذة عن الطبيب' : 'About the Doctor'}
                  </h2>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {bio}
                  </p>
                </div>
              )}

              {/* Specialization (Only if admin provided) */}
              {hasSpecialization && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs">
                  <h2 className="text-lg font-serif font-bold text-brand-dark mb-2">
                    {isAr ? 'التخصص الدقيق' : 'Specialization'}
                  </h2>
                  <p className="text-brand-dark font-medium text-sm sm:text-base leading-relaxed">
                    {specialization}
                  </p>
                </div>
              )}

              {/* Qualifications (Only if admin provided) */}
              {hasQualification && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs">
                  <h2 className="text-lg font-serif font-bold text-brand-dark mb-2">
                    {isAr ? 'المؤهلات العلمية' : 'Qualifications'}
                  </h2>
                  <p className="text-brand-dark font-medium text-sm sm:text-base leading-relaxed">
                    {qualification}
                  </p>
                </div>
              )}

              {/* Clinical Duties & Common Conditions (Only if admin provided) */}
              {hasDuties && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs">
                  <h2 className="text-lg font-serif font-bold text-brand-dark mb-4 pb-3 border-b border-border/60">
                    {isAr ? 'المهام السريرية والحالات الشائعة' : 'Clinical Duties & Common Conditions'}
                  </h2>
                  <div className="space-y-4">
                    {parsedDuties.map((section, idx) => {
                      if (section.items.length > 0) {
                        return (
                          <div key={idx} className="space-y-2">
                            {section.heading && (
                              <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                                <span>{section.heading}</span>
                              </h3>
                            )}
                            <ul className={`space-y-1.5 ${section.heading ? 'ps-4' : ''}`}>
                              {section.items.map((item, itemIdx) => (
                                <li
                                  key={itemIdx}
                                  className="text-xs sm:text-sm text-text-muted flex items-start gap-2 leading-relaxed"
                                >
                                  <span className="text-brand font-bold mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-brand-dark"
                        >
                          <span className="text-brand font-bold mt-0.5">•</span>
                          <span>{section.heading}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Responsibilities & Remarks (Only if admin provided) */}
              {hasRemarks && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs">
                  <h2 className="text-lg font-serif font-bold text-brand-dark mb-4 pb-3 border-b border-border/60">
                    {isAr ? 'مسؤوليات وملاحظات إضافية' : 'Key Responsibilities & Remarks'}
                  </h2>
                  <ul className="space-y-2">
                    {parsedRemarks.map((remark, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm text-text-muted flex items-start gap-2.5 leading-relaxed"
                      >
                        <span className="text-brand font-bold mt-0.5">•</span>
                        <span>{remark}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
