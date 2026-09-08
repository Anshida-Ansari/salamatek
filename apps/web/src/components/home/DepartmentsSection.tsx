import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { departments } from '@/data/departments';

type Props = {
  locale: Locale;
  t: Translations;
};

// SVG icons for departments
function DeptIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    dermatology: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    ),
    dental: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    ),
    ophthalmology: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    ),
    'womens-health': (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    ),
    'general-medicine': (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    laboratory: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.096.04a3.75 3.75 0 012.44 4.023 6.75 6.75 0 01-6.726 6.016h-.09A6.75 6.75 0 016.25 15.52a3.75 3.75 0 012.44-4.023l.096-.04a2.25 2.25 0 001.357-2.059V3.104" />
    ),
    physiotherapy: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    ),
    pediatrics: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    ),
    emergency: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    ),
  };

  const path = icons[id] ?? icons['general-medicine'];

  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

// Diagonal arrow icon
function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

export function DepartmentsSection({ locale, t }: Props) {
  const p = t.pages.home;
  // Display first 6 departments
  const featured = departments.slice(0, 6);

  return (
    <section
      className="bg-brand-dark py-16 md:py-24"
      aria-labelledby="departments-heading"
      id="departments"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-light mb-4">
            {p.departmentsEyebrow}
          </p>
          <h2
            id="departments-heading"
            className="text-3xl md:text-display-md font-serif font-bold text-white leading-tight mb-3"
          >
            {p.departmentsHeading}
          </h2>
          <p className="text-sm text-white/55 max-w-lg mx-auto">
            {p.departmentsSubtext}
          </p>
        </div>

        {/* 3 × 2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {featured.map((dept) => (
            <Link
              key={dept.id}
              href={getLocalizedPath(`/departments/${dept.slug}`, locale)}
              className="group relative bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] hover:border-white/[0.18] rounded-2xl p-6 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
              aria-label={`${dept.name[locale]} — ${dept.description[locale]}`}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-brand-medium/20 flex items-center justify-center text-brand-light mb-5">
                <DeptIcon id={dept.id} />
              </div>

              {/* Name */}
              <h3 className="text-base font-semibold text-white mb-1.5">
                {dept.name[locale]}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/55 leading-relaxed mb-4">
                {dept.description[locale]}
              </p>

              {/* Learn more */}
              <span className="text-xs font-semibold text-brand-red group-hover:text-brand-light transition-colors duration-150">
                {t.common.learnMore}
              </span>

              {/* Diagonal arrow */}
              <div className="absolute top-5 end-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-white/40">
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center">
          <Link
            href={getLocalizedPath('/departments', locale)}
            className="inline-flex items-center justify-center gap-2 w-full max-w-md px-6 py-4 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/05 hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
          >
            {t.common.viewAllServices}
          </Link>
        </div>
      </div>
    </section>
  );
}
