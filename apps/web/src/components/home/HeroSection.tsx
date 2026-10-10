import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { contactConfig } from '@/config/contact';
import HeroCarouselBackground from './HeroCarouselBackground';

type Props = {
  locale: Locale;
  t: Translations;
  /** Admin-managed carousel image URLs from CMS — falls back to local hospital images when empty */
  heroImages?: string[];
};

export function HeroSection({ locale, t, heroImages }: Props) {
  const p = t.pages.home;
  
  // Use admin-managed images if any are configured; otherwise fall back to local images.
  const carouselImages = heroImages && heroImages.length > 0
    ? heroImages
    : [
        '/images/hospital/exterior.jpg',
        '/images/hospital/reception.jpg',
        '/images/hospital/entrance.jpg',
        '/images/hospital/emergency-ward.jpg'
      ];

  return (
    <section
      className="relative w-full h-[calc(100svh-5rem)] min-h-[600px] max-h-[850px] flex flex-col justify-end overflow-hidden"
      aria-label={locale === 'ar' ? 'البانر الرئيسي' : 'Hero banner'}
    >
      <HeroCarouselBackground images={carouselImages} locale={locale} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-0 pointer-events-none mt-auto">
        <div className="max-w-2xl pt-20 sm:pt-24 pb-8 sm:pb-12 pointer-events-auto">
          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6EE7A8] mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {p.heroEyebrow}
          </p>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-display-xl font-serif font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            <span className="block">
              <span className="text-5xl sm:text-6xl md:text-[5.5rem] text-[#5FE3A1] font-bold me-3">
                {/* @ts-ignore */}
                {p.heroHeading1Num}
              </span>
              {/* @ts-ignore */}
              {p.heroHeading1Text}
            </span>
            <span className="block text-brand-light italic">{p.heroHeading2}</span>
          </h1>

          {/* Sub-text */}
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-lg leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {p.heroSubtext}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            <a
              href={`https://wa.me/${contactConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
            >
              {p.heroCtaPrimary}
            </a>
            <Link
              href={getLocalizedPath('/departments', locale)}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/60 text-white text-sm font-semibold hover:bg-white/20 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              {p.heroCtaSecondary}
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 py-6 flex flex-wrap items-center gap-x-12 gap-y-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] pointer-events-auto">
          <div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-white leading-none">
              {p.heroStat1Value}
            </p>
            <p className="text-xs text-white/80 mt-1">{p.heroStat1Label}</p>
          </div>
          <div className="w-px h-8 bg-white/15 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-white leading-none">
              {p.heroStat2Value}
            </p>
            <p className="text-xs text-white/80 mt-1">{p.heroStat2Label}</p>
          </div>
          <div className="w-px h-8 bg-white/15 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-white leading-none">
              {p.heroStat3Value}
            </p>
            <p className="text-xs text-white/80 mt-1">{p.heroStat3Label}</p>
          </div>


        </div>
      </div>
    </section>
  );
}
