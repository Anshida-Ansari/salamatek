import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

type Props = {
  locale: Locale;
  /** Small eyebrow badge text */
  badge: string;
  /** Main h1 heading — supports newlines (\n) for line breaks */
  heading: string;
  /** Optional subtitle paragraph */
  subtext?: string;
  /** Optional breadcrumb items — shows home + current by default */
  breadcrumbs?: BreadcrumbItem[];
  /** Background image path (from /public) */
  imageSrc?: string;
  /** Image alt text */
  imageAlt?: string;
};

/**
 * PageHero — reusable full-width hero banner for inner pages.
 * Uses the established brand colour language: brand-dark background,
 * optional background photo with overlay, eyebrow badge, h1, subtext.
 */
export function PageHero({
  locale: _locale,
  badge,
  heading,
  subtext,
  breadcrumbs,
  imageSrc,
  imageAlt = '',
}: Props) {
  const isAr = _locale === 'ar';
  const sloganText = isAr ? 'التميز في الرعاية الصحية' : 'Excellence in health care';

  return (
    <section
      className="relative bg-brand-dark w-full h-[400px] md:h-[480px] flex flex-col justify-center overflow-hidden pt-20"
      aria-label={badge}
    >
      {/* Slogan Banner Badge */}
      <div className="absolute top-24 sm:top-26 inset-x-0 z-20 pointer-events-none">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex justify-end rtl:justify-start">
          <div
            className="pointer-events-auto relative inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#D81B26] via-[#E5232F] to-[#C8101E] text-white shadow-[0_8px_24px_rgba(200,16,30,0.38)] border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 select-none"
            role="status"
            aria-label={sloganText}
          >
            <span className="text-[11px] sm:text-xs md:text-sm lg:text-base font-bold tracking-wide leading-none whitespace-nowrap drop-shadow-sm font-sans rtl:font-arabic">
              {sloganText}
            </span>
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/85 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Optional background photo */}
      {imageSrc && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="100vw"
              priority
              className="object-cover object-center"
            />
          </div>
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                _locale === 'ar'
                  ? 'linear-gradient(to left, rgba(12,53,40,0.95) 0%, rgba(12,53,40,0.7) 40%, rgba(12,53,40,0.2) 100%)'
                  : 'linear-gradient(to right, rgba(12,53,40,0.95) 0%, rgba(12,53,40,0.7) 40%, rgba(12,53,40,0.2) 100%)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-8">
            <Breadcrumbs
              items={breadcrumbs}
              locale={_locale}
              className="text-white/50"
            />
          </div>
        )}

        {/* Badge */}
        <p className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-brand-light mb-5">
          {badge}
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-display-md lg:text-display-lg font-serif font-bold text-white leading-tight mb-4 whitespace-pre-line max-w-2xl">
          {heading}
        </h1>

        {/* Sub-text */}
        {subtext && (
          <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-xl">
            {subtext}
          </p>
        )}
      </div>
    </section>
  );
}
