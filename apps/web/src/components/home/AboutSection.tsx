import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  t: Translations;
};

export function AboutSection({ locale, t }: Props) {
  const p = t.pages.home;
  const isRtl = locale === 'ar';

  return (
    <section
      className="bg-white py-16 md:py-20"
      aria-labelledby="about-heading"
      id="about"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: Eyebrow + Heading */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
              {p.aboutEyebrow}
            </p>
            <h2
              id="about-heading"
              className="text-display-md md:text-display-lg font-serif font-bold text-text-base leading-tight whitespace-pre-line"
            >
              {p.aboutHeading}
            </h2>
          </div>

          {/* Right: Description + CTA */}
          <div className="lg:pt-12">
            <p className="text-base md:text-lg leading-relaxed text-text-muted mb-6">
              {p.aboutText}
            </p>
            <Link
              href={getLocalizedPath('/about', locale)}
              className={`inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-dark transition-colors duration-150 group`}
            >
              {t.common.discoverStory}
              <span
                className={`transition-transform duration-150 group-hover:translate-x-1 ${isRtl ? 'rtl-flip' : ''}`}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
