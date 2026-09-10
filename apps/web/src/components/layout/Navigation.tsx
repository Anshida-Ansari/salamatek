'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath, cn } from '@/lib/utils';

type NavItem = {
  key: keyof Translations['nav'];
  href: string;
  sarc?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home',         href: '/' },
  { key: 'about',        href: '/about' },
  { key: 'departments',  href: '/departments' },
  { key: 'services',     href: '/services' },
  { key: 'doctors',      href: '/doctors' },
  { key: 'packages',     href: '/health-packages' },
  { key: 'sarc',         href: '/sarc', sarc: true },
  { key: 'careers',      href: '/careers' },
  { key: 'news',         href: '/news' },
  { key: 'contact',      href: '/contact' },
];

type Props = {
  locale: Locale;
  t: Translations;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  onLinkClick?: () => void;
};

export function Navigation({ locale, t, className, orientation = 'horizontal', onLinkClick }: Props) {
  const pathname = usePathname();
  const isVertical = orientation === 'vertical';

  const isActive = (href: string) => {
    const localizedHref = getLocalizedPath(href, locale);
    if (href === '/') {
      return pathname === localizedHref;
    }
    return pathname === localizedHref || pathname.startsWith(localizedHref + '/');
  };

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        isVertical ? 'flex flex-col gap-0.5' : 'flex items-center gap-0.5',
        className,
      )}
    >
      {NAV_ITEMS.map(({ key, href, sarc }) => {
        const localizedHref = getLocalizedPath(href, locale);
        const active = isActive(href);
        const label = t.nav[key] as string;

        /* ── SARC solid orange box ── */
        if (sarc) {
          return (
            <Link
              key={key}
              href={localizedHref}
              onClick={onLinkClick}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide transition-all duration-200 shadow-sm',
                'bg-[#E05522] text-white hover:bg-[#c84414] hover:shadow',
                active && 'ring-2 ring-offset-2 ring-[#E05522] shadow-md',
                isVertical && 'py-2.5 px-4 text-sm w-full text-center rounded-lg',
              )}
            >
              {label}
            </Link>
          );
        }

        /* ── Regular link with underline indicator ── */
        return (
          <Link
            key={key}
            href={localizedHref}
            onClick={onLinkClick}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 group',
              isVertical && 'py-3 px-4 rounded-xl text-base w-full',
              active
                ? 'text-brand-dark font-semibold'
                : 'text-text-base hover:text-brand-dark',
              isVertical && active && 'bg-brand-mint',
              isVertical && !active && 'hover:bg-brand-mint',
            )}
          >
            {label}

            {/* Underline indicator (horizontal only) */}
            {!isVertical && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-brand-dark transition-all duration-200',
                  active ? 'w-[70%] opacity-100' : 'w-0 opacity-0 group-hover:w-[40%] group-hover:opacity-40',
                )}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
