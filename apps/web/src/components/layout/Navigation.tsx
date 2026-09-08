import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath, cn } from '@/lib/utils';

type NavItem = {
  key: keyof Translations['nav'];
  href: string;
  highlight?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'about',        href: '/about' },
  { key: 'departments',  href: '/departments' },
  { key: 'doctors',      href: '/doctors' },
  { key: 'packages',     href: '/health-packages' },
  { key: 'sarc',         href: '/sarc', highlight: true },
  { key: 'opticalStore', href: '/optical-store' },
  { key: 'news',         href: '/news' },
  { key: 'contact',      href: '/contact' },
];

type Props = {
  locale: Locale;
  t: Translations;
  currentPath?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
};

export function Navigation({ locale, t, currentPath, className, orientation = 'horizontal' }: Props) {
  const isVertical = orientation === 'vertical';

  return (
    <nav
      aria-label="Main navigation"
      className={cn(isVertical ? 'flex flex-col gap-1' : 'flex items-center gap-0.5', className)}
    >
      {NAV_ITEMS.map(({ key, href, highlight }) => {
        const localizedHref = getLocalizedPath(href, locale);
        const isActive = currentPath === localizedHref;
        const label = t.nav[key] as string;

        if (highlight) {
          return (
            <Link
              key={key}
              href={localizedHref}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-bold text-white transition-all duration-200',
                isVertical && 'py-2.5 px-4 rounded-lg',
                isActive
                  ? 'bg-brand-orange-dark'
                  : 'bg-brand-orange hover:bg-brand-orange-dark',
              )}
            >
              {label}
            </Link>
          );
        }

        return (
          <Link
            key={key}
            href={localizedHref}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
              isVertical && 'py-2.5 px-4 rounded-lg text-base',
              isActive
                ? 'text-brand-dark bg-brand-mint font-semibold'
                : 'text-text-base hover:text-brand-dark hover:bg-brand-mint',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
