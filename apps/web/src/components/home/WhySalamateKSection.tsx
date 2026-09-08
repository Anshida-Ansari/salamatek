import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';

type Props = {
  locale: Locale;
  t: Translations;
};

const PILLARS = ['01', '02', '03'] as const;

export function WhySalamateKSection({ locale: _locale, t }: Props) {
  const p = t.pages.home;

  const pillars = [
    { num: PILLARS[0], title: p.whyPillar1Title, desc: p.whyPillar1Desc },
    { num: PILLARS[1], title: p.whyPillar2Title, desc: p.whyPillar2Desc },
    { num: PILLARS[2], title: p.whyPillar3Title, desc: p.whyPillar3Desc },
  ];

  return (
    <section
      className="bg-surface-mint py-14 md:py-20"
      aria-labelledby="why-salamatek-heading"
      id="why-salamatek"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10 items-start">

          {/* Left: eyebrow + heading */}
          <div className="lg:col-span-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
              {p.whyEyebrow}
            </p>
            <h2
              id="why-salamatek-heading"
              className="text-2xl md:text-display-sm font-serif font-bold text-text-base leading-snug whitespace-pre-line"
            >
              {p.whyHeading}
            </h2>
          </div>

          {/* Right: 3 pillar cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="bg-white rounded-2xl border border-border/50 p-6 shadow-card"
              >
                <p className="text-xs font-bold text-text-subtle mb-4 tabular-nums">
                  {pillar.num}
                </p>
                <h3 className="text-base font-semibold text-text-base mb-2 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
