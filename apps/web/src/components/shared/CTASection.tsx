import Link from 'next/link';

type Props = {
  /** Main heading */
  heading: string;
  /** Optional supporting text */
  subtext?: string;
  /** Primary CTA label */
  ctaLabel: string;
  /** Primary CTA href */
  ctaHref: string;
  /** Dark variant uses brand-dark background */
  variant?: 'dark' | 'mint';
};

/**
 * CTASection — full-width call-to-action banner used at the bottom of pages.
 */
export function CTASection({
  heading,
  subtext,
  ctaLabel,
  ctaHref,
  variant = 'dark',
}: Props) {
  const isDark = variant === 'dark';

  return (
    <section
      className={`py-14 md:py-20 ${isDark ? 'bg-brand-dark' : 'bg-surface-mint'}`}
      aria-label={ctaLabel}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className={`text-2xl md:text-display-sm font-serif font-bold mb-3 ${isDark ? 'text-white' : 'text-text-base'}`}
        >
          {heading}
        </h2>
        {subtext && (
          <p
            className={`text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed ${isDark ? 'text-white/60' : 'text-text-muted'}`}
          >
            {subtext}
          </p>
        )}
        <Link
          href={ctaHref}
          className={`inline-flex items-center px-7 py-3.5 rounded-xl text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isDark
              ? 'bg-brand-red text-white hover:bg-brand-red-dark focus-visible:ring-brand-red'
              : 'bg-brand-dark text-white hover:bg-brand-medium focus-visible:ring-brand-dark'
          }`}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
