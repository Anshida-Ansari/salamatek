'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { departments } from '@/data/departments';

type Props = {
  locale: Locale;
  t: Translations;
};

export function DoctorsSection({ locale, t }: Props) {
  const p = t.pages.home;
  const [selectedDept, setSelectedDept] = useState('');

  return (
    <section
      className="bg-white py-16 md:py-24 overflow-hidden"
      aria-labelledby="doctors-heading"
      id="doctors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Image with badge */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-h-[600px] w-full">
              <Image
                src="/images/hospital/reception.jpg"
                alt={
                  locale === 'ar'
                    ? 'طبيب يفحص مريضًا في مجمع سلامتك الطبي'
                    : 'Doctor examining a patient at Salamatek Medical Centre'
                }
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>

            {/* Floating badge */}
            <div
              className="absolute bottom-8 end-0 translate-x-4 md:translate-x-6 bg-brand-medium text-white rounded-2xl w-28 h-28 flex flex-col items-center justify-center shadow-card-lg text-center"
              aria-hidden="true"
            >
              <p className="text-2xl font-bold font-serif leading-none">{p.doctorsBadgeValue}</p>
              <p className="text-[10px] leading-snug mt-1 text-white/85 whitespace-pre-line">{p.doctorsBadgeLabel}</p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
              {p.doctorsEyebrow}
            </p>

            <h2
              id="doctors-heading"
              className="text-display-md md:text-display-lg font-serif font-bold text-text-base leading-tight mb-4"
            >
              <span className="block">{p.doctorsHeading1}</span>
              <span className="block">{p.doctorsHeading2}</span>
            </h2>

            <p className="text-base text-text-muted leading-relaxed mb-8 max-w-md">
              {p.doctorsSubtext}
            </p>

            {/* Department search widget */}
            <div className="bg-surface-light border border-border rounded-xl p-4 mb-8 max-w-md">
              <p className="text-xs font-semibold text-text-muted mb-3">
                {p.doctorsFindLabel}
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <select
                    id="doctor-search-dept"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full h-10 ps-3 pe-8 text-sm border border-border rounded-lg bg-white text-text-base focus:outline-none focus:ring-2 focus:ring-brand-medium appearance-none"
                    aria-label={p.doctorsFindLabel}
                  >
                    <option value="">{p.doctorsDeptPlaceholder}</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name[locale]}
                      </option>
                    ))}
                  </select>
                  {/* Chevron */}
                  <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center" aria-hidden="true">
                    <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <Link
                  href={
                    selectedDept
                      ? getLocalizedPath(`/doctors?dept=${selectedDept}`, locale)
                      : getLocalizedPath('/doctors', locale)
                  }
                  className="px-4 h-10 rounded-lg bg-brand-dark text-white text-sm font-semibold hover:bg-brand-medium transition-colors duration-150 flex items-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium"
                >
                  {p.doctorsSearchBtn}
                </Link>
              </div>
            </div>

            {/* Meet doctors link */}
            <Link
              href={getLocalizedPath('/doctors', locale)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors duration-150 group"
            >
              {t.common.meetDoctors}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
