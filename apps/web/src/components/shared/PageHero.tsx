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
  return (
    <section
      className="relative bg-brand-dark pt-10 pb-14 md:pt-14 md:pb-20 overflow-hidden"
      aria-label={badge}
    >
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
              className="object-cover object-center opacity-25"
            />
          </div>
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(12,53,40,0.95) 0%, rgba(12,53,40,0.85) 100%)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
