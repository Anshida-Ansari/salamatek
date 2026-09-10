import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  t: Translations;
  /** Optional dynamic hero image URL from CMS — falls back to local exterior.jpg */
  heroImage?: string | undefined;
};

export function HeroSection({ locale, t, heroImage }: Props) {
  const p = t.pages.home;
  const bgSrc = heroImage || '/images/hospital/exterior.jpg';

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden"
      aria-label={locale === 'ar' ? 'البانر الرئيسي' : 'Hero banner'}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgSrc}
          alt={
            locale === 'ar'
              ? 'مجمع سلامتك الطبي — مبنى المجمع'
              : 'Salamatek Medical Centre — building exterior'
          }
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay: dark at bottom and left for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,28,22,0.98) 0%, rgba(10,28,22,0.82) 45%, rgba(10,28,22,0.35) 100%)',
          }}
          aria-hidden="true"
        />
        {/* Additional horizontal gradient for RTL/LTR text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              locale === 'ar'
                ? 'linear-gradient(to left, rgba(10,28,22,0.9) 0%, rgba(10,28,22,0.4) 55%, transparent 100%)'
                : 'linear-gradient(to right, rgba(10,28,22,0.9) 0%, rgba(10,28,22,0.4) 55%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-0">
        <div className="max-w-2xl pt-32 pb-12">
          {/* Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-widest text-brand-light mb-5">
            {p.heroEyebrow}
          </p>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-display-xl font-serif font-bold text-white leading-tight mb-4">
            <span className="block">{p.heroHeading1}</span>
            <span className="block text-brand-light italic">{p.heroHeading2}</span>
          </h1>

          {/* Sub-text */}
          <p className="text-base sm:text-lg text-white/75 mb-8 max-w-lg leading-relaxed">
            {p.heroSubtext}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={getLocalizedPath('/contact', locale)}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            >
              {p.heroCtaPrimary}
            </Link>
            <Link
              href={getLocalizedPath('/departments', locale)}
              className="inline-flex items-center px-6 py-3 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {p.heroCtaSecondary}
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 py-6 flex flex-wrap items-center gap-x-12 gap-y-4">
          <div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-white leading-none">
              {p.heroStat1Value}
            </p>
            <p className="text-xs text-white/55 mt-1">{p.heroStat1Label}</p>
          </div>
          <div className="w-px h-8 bg-white/15 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-white leading-none">
              {p.heroStat2Value}
            </p>
            <p className="text-xs text-white/55 mt-1">{p.heroStat2Label}</p>
          </div>
          <div className="w-px h-8 bg-white/15 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-white leading-none">
              {p.heroStat3Value}
            </p>
            <p className="text-xs text-white/55 mt-1">{p.heroStat3Label}</p>
          </div>

          {/* Availability badge */}
          <div className="ms-auto hidden md:flex items-center gap-2 text-sm text-white/70">
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{p.heroAvailability}</span>
            <span className="text-brand-light font-semibold">{p.heroChooseTime}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
