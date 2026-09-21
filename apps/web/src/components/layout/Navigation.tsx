'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  isTransparent?: boolean;
};

export function Navigation({ locale, t, className, orientation = 'horizontal', onLinkClick, isTransparent = false }: Props) {
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

        /* ── SARC logo link ── */
        if (sarc) {
          return (
            <Link
              key={key}
              href={localizedHref}
              onClick={onLinkClick}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center justify-center transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm',
                active && 'opacity-90',
                isVertical && 'w-full justify-start px-4 py-2',
              )}
            >
              <Image
                src="/images/sarc-logo.png"
                alt="SARC — Industrial Healthcare"
                width={120}
                height={40}
                className={cn(
                  'object-contain h-8 w-auto',
                  isVertical && 'h-9',
                )}
                style={isTransparent ? { filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' } : undefined}
                priority={false}
              />
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
                ? (isTransparent ? 'text-white font-bold' : 'text-brand-dark font-semibold')
                : (isTransparent ? 'text-white/80 hover:text-white' : 'text-text-base hover:text-brand-dark'),
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
                  'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-200',
                  isTransparent ? 'bg-white' : 'bg-brand-dark',
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
