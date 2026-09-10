import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  t: Translations;
  /** Dynamic hero image from CMS (passed from parent server component) */
  imageSrc?: string | undefined;
};

export function SARCSection({ locale, t, imageSrc }: Props) {
  const p = t.pages.home;

  const steps = [
    { num: '01', title: p.sarcStep1Title, desc: p.sarcStep1Desc },
    { num: '02', title: p.sarcStep2Title, desc: p.sarcStep2Desc },
    { num: '03', title: p.sarcStep3Title, desc: p.sarcStep3Desc },
  ];

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      aria-labelledby="sarc-heading"
      id="sarc"
    >
      {/* Background — dynamic image or gradient fallback */}
      <div className="absolute inset-0 z-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="SARC industrial healthcare"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #E05522 0%, #B8441A 30%, #8B2615 65%, #3B1408 100%)' }}
          />
        )}
        {/* Dark overlay always present for readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(35,10,4,0.97) 0%, rgba(59,20,8,0.85) 50%, rgba(62,14,5,0.55) 100%)' }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: Content */}
          <div>
            {/* SARC wordmark */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                {p.sarcEyebrow}
              </span>
            </div>

            <h2
              id="sarc-heading"
              className="text-3xl md:text-display-md font-serif font-bold text-white leading-tight mb-6 whitespace-pre-line"
            >
              {p.sarcHeading}
            </h2>

            <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8 max-w-md">
              {p.sarcSubtext}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={getLocalizedPath('/sarc', locale)}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-[#8B2615] text-sm font-bold hover:bg-orange-50 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t.common.exploreSarc}
                <svg className="w-4 h-4 ms-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link
                href={getLocalizedPath('/sarc#enquire', locale)}
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors duration-150 underline underline-offset-4"
              >
                {t.common.requestProposal}
              </Link>
            </div>
          </div>

          {/* Right: Process card */}
          <div className="bg-white/[0.08] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                {p.sarcModelTitle}
              </span>
              <span className="text-xs font-semibold text-white">
                {p.sarcModelTagline}
              </span>
            </div>

            {/* Steps */}
            <div className="divide-y divide-white/[0.07]">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-4 px-5 py-5">
                  <div
                    className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <span className="text-[10px] font-bold text-white/60">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-white/55 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer badge */}
            <div className="mx-5 mb-5 mt-1">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3">
                <span
                  className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-xs text-white/80">{p.sarcBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
