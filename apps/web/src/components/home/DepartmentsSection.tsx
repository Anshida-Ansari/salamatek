import Link from 'next/link';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  t: Translations;
};

async function getDepartments() {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';
    const res = await fetch(`${apiUrl}/departments?active=true&limit=6`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

// Exact order required for departments
const DEPARTMENT_SLUG_ORDER = [
  'internal-medicine',        // 1. Internal Medicine
  'general-medicine',         // 2. General Medicine
  'obstetrics-gynaecology',   // 3. Obstetrics and Gynaecology
  'paediatrics',              // 4. Pediatrics
  'dermatology-cosmetology',  // 5. Derma
  'cosmetology',              // 6. Cosmotology
  'ophthalmology',            // 7. Ophthalmology
  'orthopaedics',             // 8. Orthopedics
  'orthodontics',             // 9. Orthodontics
  'ent',                      // 10. ENT
  'general-surgeon',          // 11. General Surgeon
  'dental',                   // 12. Dental
  'physiotherapy',            // 13. Physiotherapy
  'laboratory',               // 14. Laboratory
  'radiology',                // 15. Radiology
  'pharmacy',                 // 16. Pharmacy
  'iqama-baladia',            // 17. IQAMA/BALADIYA Medical Departmen
];

function sortDepartments(list: any[]): any[] {
  return [...list].sort((a: any, b: any) => {
    const idxA = DEPARTMENT_SLUG_ORDER.indexOf(a.slug);
    const idxB = DEPARTMENT_SLUG_ORDER.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return (a.order ?? 999) - (b.order ?? 999);
  });
}

// Arrow icon with smooth hover motion
function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

export async function DepartmentsSection({ locale, t }: Props) {
  const p = t.pages.home;
  const depts = await getDepartments();
  const featured = sortDepartments(depts);
  const isRtl = locale === 'ar';

  return (
    <section
      className="relative bg-brand-dark py-14 sm:py-20 md:py-28 overflow-hidden"
      aria-labelledby="departments-heading"
      id="departments"
    >
      {/* Subtle top ambient glow for medical luxury depth */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-brand-medium/15 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-brand-pale text-xs font-semibold uppercase tracking-wider mb-3.5 backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-light" aria-hidden="true" />
              <span>{p.departmentsEyebrow}</span>
            </div>

            {/* Main Title */}
            <h2
              id="departments-heading"
              className="text-2xl sm:text-4xl lg:text-display-sm font-serif font-bold text-white leading-tight tracking-tight mb-3"
            >
              {p.departmentsHeading}
            </h2>

            {/* Supporting Description */}
            <p className="text-sm sm:text-base text-white/75 leading-relaxed max-w-xl">
              {p.departmentsSubtext}
            </p>
          </div>

          {/* Desktop Direct Link to Directory */}
          <div className="hidden md:flex flex-shrink-0">
            <Link
              href={getLocalizedPath('/departments', locale)}
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-brand-pale/50 text-white text-sm font-semibold transition-all duration-200 shadow-sm"
            >
              <span>{t.common.viewAllServices}</span>
              <span className={`inline-block transition-transform duration-200 group-hover:translate-x-1 ${isRtl ? 'rtl-flip' : ''}`} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* 3 × 2 Modern Healthcare Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {featured.map((dept: any) => {
            const deptName = dept.name[locale] || dept.name.en;
            const deptSub = dept.subheading?.[locale] || dept.subheading?.en;
            const deptDesc = dept.description?.[locale] || dept.description?.en || '';

            return (
              <Link
                key={dept._id}
                href={getLocalizedPath(`/departments/${dept.slug}`, locale)}
                className="group relative h-[360px] sm:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#0C3528] flex flex-col justify-between p-5 sm:p-7 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)] hover:border-brand-pale/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
                aria-label={`${deptName} — ${deptDesc}`}
              >
                {/* Department Background Image */}
                {dept.image ? (
                  <Image
                    src={dept.image}
                    alt={deptName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-medium/40 to-brand-dark" />
                )}

                {/* Dark Vignette + Bottom Emerald Gradient for Crystal-Clear Readability */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/55 via-brand-dark/65 to-brand-dark/95 transition-opacity duration-300 group-hover:opacity-90"
                  aria-hidden="true"
                />

                {/* Subtle Radial Emerald Glow on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,158,114,0.35),transparent_70%)] pointer-events-none"
                  aria-hidden="true"
                />

                {/* Card Top: Action Button */}
                <div className="relative z-10 flex items-center justify-end w-full">
                  {/* Circular Arrow Action Button */}
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xs group-hover:bg-brand-red group-hover:border-brand-red group-hover:text-white transition-all duration-300">
                    <ArrowIcon className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Card Bottom: Typography & Medical Details */}
                <div className="relative z-10">
                  {/* Subheading / Clinical Specialty */}
                  {deptSub && (
                    <p className="text-[11px] sm:text-xs font-semibold text-brand-pale tracking-wide line-clamp-1 mb-1.5 opacity-90 drop-shadow-xs">
                      {deptSub}
                    </p>
                  )}

                  {/* Department Name */}
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-brand-mint transition-colors duration-200 leading-snug mb-2 drop-shadow-xs">
                    {deptName}
                  </h3>

                  {/* Department Clinical Description */}
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2 mb-4 drop-shadow-xs">
                    {deptDesc}
                  </p>

                  {/* Clean Action Divider */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-brand-pale transition-colors flex items-center gap-1.5">
                      <span>{t.common.learnMore}</span>
                      <span className={`inline-block transition-transform duration-200 group-hover:translate-x-1 ${isRtl ? 'rtl-flip' : ''}`} aria-hidden="true">
                        →
                      </span>
                    </span>

                    <span className="text-[11px] font-medium text-white/50 group-hover:text-white/80 transition-colors">
                      Salamatek Medical
                    </span>
                  </div>
                </div>

                {/* Bottom Interactive Accent Bar */}
                <div
                  className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-brand-pale via-brand-light to-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left rtl:origin-right"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>

        {/* View All CTA (Mobile & Tablet primary, Desktop supplementary) */}
        <div className="text-center mt-8 sm:mt-12 md:hidden">
          <Link
            href={getLocalizedPath('/departments', locale)}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold transition-all duration-200"
          >
            <span>{t.common.viewAllServices}</span>
            <span className={`inline-block transition-transform duration-200 ${isRtl ? 'rtl-flip' : ''}`} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
