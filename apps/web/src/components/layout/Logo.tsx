import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/lib/utils';

type Props = {
  locale: Locale;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
};

const sizes = { sm: 'h-10', md: 'h-12', lg: 'h-14' };

export function Logo({ locale, variant = 'dark', size = 'md' }: Props) {
  const isDark = variant === 'dark';

  return (
    <Link
      href={getLocalizedPath('/', locale)}
      className="flex items-center gap-3 group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium rounded-lg"
      aria-label="Salamatek Medical Centre — Home"
    >
      {/* Emblem */}
      <div
        className={`${sizes[size]} aspect-square rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${
          isDark ? 'bg-brand-dark' : 'bg-white/15 backdrop-blur-sm'
        }`}
      >
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[60%] h-[60%]">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" className={isDark ? 'text-white' : 'text-white'} />
          {/* Medical cross */}
          <rect x="20" y="10" width="8" height="28" rx="2" fill="currentColor" className={isDark ? 'text-white' : 'text-white'} />
          <rect x="10" y="20" width="28" height="8" rx="2" fill="currentColor" className={isDark ? 'text-white' : 'text-white'} />
        </svg>
      </div>

      {/* Text */}
      <div className="leading-tight">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isDark ? 'text-brand-dark' : 'text-white/80'
          }`}
        >
          {locale === 'ar' ? 'مجمع' : 'Salamatek'}
        </p>
        <p
          className={`text-sm font-bold leading-none ${
            isDark ? 'text-brand-dark' : 'text-white'
          }`}
        >
          {locale === 'ar' ? 'سلامتك الطبي' : 'Medical Centre'}
        </p>
      </div>
    </Link>
  );
}
