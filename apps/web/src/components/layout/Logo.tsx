import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  type?: 'icon' | 'horizontal';
};

const sizes = { sm: 'h-10', md: 'h-12', lg: 'h-14' };
const horizSizes = { sm: 'h-12', md: 'h-14', lg: 'h-16' };

export function Logo({ locale, variant = 'dark', size = 'md', type = 'icon' }: Props) {
  const isDark = variant === 'dark';

  if (type === 'horizontal') {
    return (
      <Link
        href={getLocalizedPath('/', locale)}
        className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium rounded-lg"
        aria-label="Salamatek Medical Centre — Home"
      >
        <img
          src="/images/logo-official.png"
          alt="Salamatek Medical Center Company"
          className="h-11 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
          style={{ mixBlendMode: 'multiply' }}
        />
      </Link>
    );
  }

  return (
    <Link
      href={getLocalizedPath('/', locale)}
      className="flex items-center gap-3 group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium rounded-lg"
      aria-label="Salamatek Medical Centre — Home"
    >
      <div
        className={`${sizes[size]} aspect-square rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 overflow-hidden border-2 ${
          isDark ? 'border-brand-dark/10 bg-white' : 'border-white/20 bg-white'
        }`}
      >
        <img
          src="/images/logo.png"
          alt="Salamatek Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      <div className="leading-none flex flex-col justify-center">
        {locale === 'ar' ? (
          <>
            <p className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-brand-dark' : 'text-white'}`}>
              سلامتك
            </p>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isDark ? 'text-brand-medium' : 'text-white/80'}`}>
              مجمع طبي
            </p>
          </>
        ) : (
          <>
            <p className="text-xl sm:text-2xl font-bold text-brand-red uppercase tracking-wide">
              SALAMATEK
            </p>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isDark ? 'text-brand-medium' : 'text-white/80'}`}>
              Medical Center
            </p>
          </>
        )}
      </div>
    </Link>
  );
}
