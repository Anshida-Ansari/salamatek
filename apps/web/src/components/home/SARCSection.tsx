import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  t: Translations;
};

export function SARCSection({ locale, t }: Props) {
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
      style={{
        background: 'linear-gradient(135deg, #E05522 0%, #B8441A 30%, #8B2615 65%, #3B1408 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: Content */}
          <div>
            {/* SARC logo text mark */}
            <div className="flex items-center gap-1 mb-6">
              <svg viewBox="0 0 60 40" className="w-16 h-10" aria-hidden="true" fill="none">
                <text x="0" y="32" fontSize="32" fontWeight="900" fill="white" fontFamily="sans-serif">
                  SARC
                </text>
              </svg>
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              {p.sarcEyebrow}
            </p>

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
                className="inline-flex items-center px-5 py-2.5 rounded-lg border border-white text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {t.common.exploreSarc}
              </Link>
              <Link
                href={getLocalizedPath('/contact', locale)}
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors duration-150"
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
