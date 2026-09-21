'use client';

import { useRouter, usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { LOCALES, LOCALE_LABELS } from '@/i18n/config';
import { stripLocale } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Props = {
  currentLocale: Locale;
  variant?: 'header' | 'mobile';
  className?: string;
  isTransparent?: boolean;
};

export function LanguageSwitcher({ currentLocale, variant = 'header', className, isTransparent = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSwitch(locale: Locale): void {
    const stripped = stripLocale(pathname, LOCALES);
    const newPath = `/${locale}${stripped === '/' ? '' : stripped}`;
    router.push(newPath);
  }

  const otherLocale = LOCALES.find((l) => l !== currentLocale) as Locale;

  if (variant === 'mobile') {
    return (
      <div className={cn('flex gap-2', className)}>
        {LOCALES.map((locale) => (
          <button
            key={locale}
            onClick={() => handleSwitch(locale)}
            aria-current={locale === currentLocale ? 'true' : undefined}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
              locale === currentLocale
                ? 'bg-brand-dark text-white'
                : 'bg-surface-light text-text-base hover:bg-brand-mint',
            )}
          >
            {LOCALE_LABELS[locale]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => handleSwitch(otherLocale)}
      className={cn(
        'text-sm font-medium transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-medium rounded px-1',
        isTransparent ? 'text-white/80 hover:text-white' : 'text-text-base hover:text-brand-dark',
        className,
      )}
      lang={otherLocale}
      aria-label={`Switch to ${LOCALE_LABELS[otherLocale]}`}
    >
      {LOCALE_LABELS[otherLocale]}
    </button>
  );
}
