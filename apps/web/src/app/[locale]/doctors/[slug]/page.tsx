import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { CTASection } from '@/components/shared/CTASection';
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle2,
  Stethoscope,
  Globe,
  Languages,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

interface DutyGroup {
  title: string;
  items: string[];
}

/**
 * Intelligent parser that strips control chars like \u0001 (Word bullet artifact),
 * identifies major headings (•) and sub-items (o, -, *), and returns structured groups.
 */
function parseClinicalDuties(text?: string): DutyGroup[] {
  if (!text) return [];
  // Strip non-printable control characters (including \u0001 which causes hollow box glyphs ▯)
  const cleaned = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
  if (!cleaned) return [];

  const rawLines = cleaned.split('\n').map((l) => l.trim()).filter(Boolean);
  const groups: DutyGroup[] = [];
  let currentGroup: DutyGroup | null = null;

  for (const rawLine of rawLines) {
    const isSub = /^[oO\-\*]\s*/.test(rawLine);
    const isMain = /^[•\u2022\u25CF\u25A0▪]\s*/.test(rawLine);

    if (isMain) {
      const title = rawLine.replace(/^[•\u2022\u25CF\u25A0▪]\s*/, '').trim();
      currentGroup = { title, items: [] };
      groups.push(currentGroup);
    } else if (isSub) {
      const item = rawLine.replace(/^[oO\-\*\u25E6\u2022\u25AA]\s*/, '').trim();
      if (!currentGroup) {
        currentGroup = { title: '', items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(item);
    } else {
      if (!currentGroup) {
        currentGroup = { title: rawLine, items: [] };
        groups.push(currentGroup);
      } else {
        currentGroup.items.push(rawLine);
      }
    }
  }

  return groups;
}

/**
 * Splits slash-delimited or multi-line remarks into clean, capitalized clinical items.
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
  const languages = doc.languages?.[typedLocale] || doc.languages?.en || [];
  const nationality = doc.nationality?.[typedLocale] || doc.nationality?.en;
  const rawDuties = doc.clinicalDuties?.[typedLocale] || doc.clinicalDuties?.en;
  const rawRemarks = doc.remarks?.[typedLocale] || doc.remarks?.en;

  const dutyGroups = parseClinicalDuties(rawDuties);
  const parsedRemarks = parseRemarks(rawRemarks);

  // Other doctors in the same department
  const deptId = typeof doc.departmentId === 'object' ? doc.departmentId?._id : doc.departmentId;
  const relatedDoctors = doctors
    .filter((d: any) => {
      if (d.slug === doc.slug) return false;
      const dDeptId = typeof d.departmentId === 'object' ? d.departmentId?._id : d.departmentId;
      return dDeptId && dDeptId === deptId;
    })
    .slice(0, 3);

  const phoneHref = 'tel:0136642193';
  const whatsappText = isAr
    ? `السلام عليكم، أود الاستفسار وحجز موعد مع ${name}`
    : `Hello, I would like to inquire and book a consultation with ${name}`;
  const whatsappHref = `https://wa.me/966532963521?text=${encodeURIComponent(whatsappText)}`;

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      {/* ── 1. Executive Doctor Profile Hero ────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-brand-dark via-[#0C3528] to-[#08221A] text-white pt-24 pb-14 md:pt-28 md:pb-20 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-light/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-brand-pale/75" aria-label="Breadcrumbs">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Doctor Portrait Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative w-64 sm:w-72 lg:w-80 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-brand-dark/40 group shrink-0">
                {doc.image ? (
                  <Image
                    src={doc.image}
                    alt={name}
                    fill
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
                    priority
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-dark/60 text-white/40">
                    <User className="w-24 h-24" />
                  </div>
                )}

                {/* Floating Experience Badge */}
                {doc.experienceYears ? (
                  <div className="absolute bottom-3 inset-x-3 bg-brand-dark/90 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 text-center shadow-lg">
                    <p className="text-[11px] uppercase tracking-wider text-brand-pale font-medium">
                      {isAr ? 'الخبرة السريرية' : 'Clinical Experience'}
                    </p>
                    <p className="text-base font-bold text-white tabular-nums">
                      {doc.experienceYears}+ {isAr ? 'عاماً' : 'Years'}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Profile Intro & Quick Actions */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-start">
              {departmentName && (
                <Link
                  href={getLocalizedPath(`/departments/${departmentSlug}`, typedLocale)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-brand-pale border border-white/15 text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-brand-light" />
                  <span>{departmentName}</span>
                </Link>
              )}

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                  {name}
                </h1>
                {designation && (
                  <p className="text-lg sm:text-xl font-medium text-brand-pale mt-2">
                    {designation}
                  </p>
                )}
                {specialization && (
                  <p className="text-sm text-white/70 mt-1">
                    {specialization}
                  </p>
                )}
              </div>

              {/* Quick Credential Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                {nationality && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/90">
                    <Globe className="w-3.5 h-3.5 text-brand-light" />
                    <span>{nationality}</span>
                  </span>
                )}
                {languages.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/90">
                    <Languages className="w-3.5 h-3.5 text-brand-light" />
                    <span>{languages.join(', ')}</span>
                  </span>
                )}
                {qualification && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/90">
                    <GraduationCap className="w-3.5 h-3.5 text-brand-light" />
                    <span>{qualification}</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  href={getLocalizedPath('/contact', typedLocale)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand text-white hover:bg-brand-medium text-sm font-semibold transition-all shadow-lg shadow-brand/25 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isAr ? 'حجز موعد استشارة' : 'Book Consultation'}</span>
                </Link>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-500/30 text-sm font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                </a>

                <a
                  href={phoneHref}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-sm font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-light" />
                  <span dir="ltr">013 664 2193</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Detailed Clinical Information ────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Main Clinical Details (8 cols) */}
            <div className="lg:col-span-8 space-y-10">

              {/* Bio / Introduction */}
              {bio && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs space-y-3">
                  <h2 className="text-xl font-serif font-bold text-brand-dark">
                    {isAr ? 'نبذة عن الطبيب' : 'About Doctor'}
                  </h2>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                    {bio}
                  </p>
                </div>
              )}

              {/* Key Clinical Focus & Special Procedures (Parsed Remarks) */}
              {parsedRemarks.length > 0 && (
                <div className="bg-gradient-to-br from-surface-mint/70 via-white to-surface-mint/40 border border-brand/20 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-brand text-white flex items-center justify-center shadow-xs shrink-0">
                      <Sparkles className="w-5 h-5 text-brand-light" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-brand-dark">
                        {isAr ? 'مجالات التركيز السريري والإجراءات الخاصة' : 'Key Clinical Focus & Special Procedures'}
                      </h2>
                      <p className="text-xs text-text-muted">
                        {isAr
                          ? 'خبرات علاجية متقدمة وإجراءات تخصصية دقيقة'
                          : 'Targeted interventions, specialized care, and advanced procedures'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {parsedRemarks.map((remark, idx) => (
                      <div
                        key={idx}
                        className="bg-white/90 backdrop-blur-xs border border-brand/15 rounded-2xl p-4 flex items-start gap-3 shadow-2xs hover:border-brand/40 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-light mt-1.5 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-brand-dark leading-snug">
                          {remark}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Scope & Medical Services (Parsed Duties) */}
              {dutyGroups.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-surface-mint text-brand flex items-center justify-center shadow-xs shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-dark">
                        {isAr ? 'نطاق الخدمات والمهام السريرية' : 'Clinical Scope & Medical Duties'}
                      </h2>
                      <p className="text-xs text-text-muted">
                        {isAr
                          ? 'الخدمات التشخيصية والعلاجية المقدمة للمرضى'
                          : 'Comprehensive diagnostic, consultative, and therapeutic services'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dutyGroups.map((group, idx) => {
                      const hasItems = group.items.length > 0;

                      if (!hasItems) {
                        return (
                          <div
                            key={idx}
                            className="bg-white border border-border/80 rounded-2xl p-4.5 shadow-xs flex items-center gap-3 hover:border-brand/30 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-xl bg-surface-mint text-brand flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-brand-dark">
                              {group.title}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          className="bg-white border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-card transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-border/60">
                              <div className="w-2 h-2 rounded-full bg-brand" />
                              <h3 className="text-sm sm:text-base font-bold text-brand-dark">
                                {group.title}
                              </h3>
                            </div>
                            <ul className="space-y-2.5">
                              {group.items.map((it, itemIdx) => (
                                <li
                                  key={itemIdx}
                                  className="flex items-start gap-2.5 text-xs sm:text-sm text-text-muted leading-relaxed"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                                  <span>{it}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Academic Qualifications & Credentials */}
              {qualification && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs shrink-0">
                      <GraduationCap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-brand-dark">
                        {isAr ? 'المؤهلات العلمية والتخصص' : 'Qualifications & Education'}
                      </h2>
                      <p className="text-xs text-text-muted">
                        {isAr ? 'الدرجات والاعتمادات الأكاديمية' : 'Academic degrees and professional credentials'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-brand-dark font-medium text-sm sm:text-base leading-relaxed bg-surface-mint/30 p-4 rounded-2xl border border-border/60">
                      {qualification}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Sticky Consultation Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

              {/* Consultation Booking Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border/90 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-surface-mint text-brand flex items-center justify-center shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-dark">
                      {isAr ? 'طلب موعد استشارة' : 'Book a Consultation'}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {isAr ? 'استجابة سريعة من قسم المواعيد' : 'Quick confirmation within 15 min'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-border/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-text-muted">
                    <span>{isAr ? 'القسم الطبي:' : 'Department:'}</span>
                    <span className="font-semibold text-brand-dark">{departmentName || 'Salamatek'}</span>
                  </div>
                  {doc.experienceYears ? (
                    <div className="flex items-center justify-between text-text-muted">
                      <span>{isAr ? 'سنوات الخبرة:' : 'Experience:'}</span>
                      <span className="font-semibold text-brand-dark">{doc.experienceYears}+ {isAr ? 'سنوات' : 'Years'}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-text-muted">
                    <span>{isAr ? 'طوارئ المركز:' : 'Emergency Unit:'}</span>
                    <span className="font-semibold text-emerald-700">{isAr ? 'متاح 24/7' : '24/7 Open'}</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  <Link
                    href={getLocalizedPath('/contact', typedLocale)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-brand hover:bg-brand-medium text-white text-sm font-semibold transition-colors shadow-xs"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isAr ? 'طلب حجز موعد الآن' : 'Request Appointment'}</span>
                  </Link>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/60 text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'تواصل عبر واتساب' : 'Chat via WhatsApp'}</span>
                  </a>

                  <a
                    href={phoneHref}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-border/80 text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{isAr ? 'اتصال مباشر:' : 'Direct Call:'} <span dir="ltr">013 664 2193</span></span>
                  </a>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-[11px] text-text-muted">
                  <Clock className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>{isAr ? 'السبت - الخميس: 8:00 ص - 10:00 م' : 'Sat - Thu: 8:00 AM - 10:00 PM'}</span>
                </div>
              </div>

              {/* Quality & Accreditation Card */}
              <div className="bg-white rounded-3xl p-5 border border-border/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-brand-dark">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  <span>{isAr ? 'معايير جودة الرعاية الصحية' : 'Certified Healthcare Standards'}</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {isAr
                    ? 'مجمع سلامتك الطبي معتمد من المركز السعودي لاعتماد المنشآت الصحية (سباهي CBAHI) وحاصل على شهادة ISO 9001:2015.'
                    : 'Salamatek Medical Center is CBAHI accredited and ISO 9001:2015 certified, adhering to highest patient safety protocols.'}
                </p>
              </div>

              {/* Department Shortcut */}
              {departmentName && departmentSlug && (
                <div className="bg-surface-mint/40 rounded-3xl p-5 border border-border/80 text-center space-y-2.5">
                  <p className="text-xs text-text-muted">
                    {isAr ? 'تعرف على كافة خدمات' : 'Explore services in'}
                  </p>
                  <Link
                    href={getLocalizedPath(`/departments/${departmentSlug}`, typedLocale)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-dark transition-colors"
                  >
                    <span>{departmentName}</span>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Related Specialists in Department ────────────────────────── */}
      {relatedDoctors.length > 0 && (
        <section className="bg-white py-14 md:py-18 border-t border-border/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  {departmentName}
                </span>
                <h2 className="text-2xl font-serif font-bold text-brand-dark mt-1">
                  {isAr ? 'أطباء آخرون في نفس القسم' : 'Other Specialists in this Department'}
                </h2>
              </div>
              {departmentSlug && (
                <Link
                  href={getLocalizedPath(`/departments/${departmentSlug}`, typedLocale)}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                >
                  <span>{isAr ? 'عرض القسم' : 'View Department'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDoctors.map((otherDoc: any) => {
                const otherName = otherDoc.name[typedLocale] || otherDoc.name.en;
                const otherDesignation = otherDoc.designation?.[typedLocale] || otherDoc.designation?.en;

                return (
                  <Link
                    key={otherDoc._id}
                    href={getLocalizedPath(`/doctors/${otherDoc.slug}`, typedLocale)}
                    className="group bg-[#F8FAF9] rounded-3xl p-5 border border-border/70 shadow-xs hover:shadow-card hover:border-brand/40 transition-all flex items-center gap-4"
                  >
                    <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-surface-mint shrink-0 border border-border/60">
                      {otherDoc.image ? (
                        <Image
                          src={otherDoc.image}
                          alt={otherName}
                          fill
                          sizes="64px"
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-brand-dark truncate group-hover:text-brand transition-colors">
                        {otherName}
                      </h3>
                      {otherDesignation && (
                        <p className="text-xs text-text-muted truncate mt-0.5">
                          {otherDesignation}
                        </p>
                      )}
                      {otherDoc.experienceYears ? (
                        <span className="inline-block mt-2 text-[11px] font-semibold text-brand">
                          {otherDoc.experienceYears}+ {isAr ? 'عاماً خبرة' : 'Years Experience'}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Bottom CTA ──────────────────────────────────────────────── */}
      <CTASection
        heading={isAr ? `احجز موعد استشارتك مع ${name}` : `Consult with ${name}`}
        subtext={
          isAr
            ? 'فريق خدمة المرضى في مجمع سلامتك الطبي جاهز لتأكيد موعدك والرد على كافة استفساراتك.'
            : 'Our patient care team at Salamatek Medical Center is ready to assist and confirm your appointment.'
        }
        ctaLabel={isAr ? 'طلب موعد الآن' : 'Request Appointment'}
        ctaHref={getLocalizedPath('/contact', typedLocale)}
        variant="dark"
      />
    </main>
  );
}
