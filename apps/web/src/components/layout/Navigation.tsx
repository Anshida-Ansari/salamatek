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
  dropdown?: { key: keyof Translations['nav']; href: string }[];
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home',         href: '/' },
  { 
    key: 'about',        
    href: '/about',
    dropdown: [
      { key: 'aboutDropdownSalamatek', href: '/about#about-intro-heading' },
      { key: 'aboutDropdownChairman', href: '/about#chairman-heading' },
      { key: 'aboutDropdownMission', href: '/about#mission-vision-heading' },
      { key: 'aboutDropdownAccreditations', href: '/about#accreditations-heading' },
    ]
  },
  { key: 'departments',  href: '/departments' },
  { key: 'services',     href: '/services' },
  { key: 'doctors',      href: '/doctors' },
  { key: 'packages',     href: '/health-packages' },
  { key: 'gallery',      href: '/gallery' },
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
        isVertical ? 'flex flex-col gap-1' : 'flex items-center gap-1 xl:gap-2',
        className,
      )}
    >
      {NAV_ITEMS.map(({ key, href, sarc, dropdown }) => {
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
              aria-label="SARC — Industrial Healthcare"
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative inline-flex items-center justify-center transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm',
                active && 'opacity-90',
                isVertical ? 'w-full justify-start px-4 py-2 mt-2' : 'px-2 xl:px-3 py-2'
              )}
            >
              <Image
                src="/images/sarc-logo-transparent.png"
                alt="SARC"
                width={120}
                height={40}
                className={cn("object-contain transition-transform hover:scale-105", isVertical ? 'w-[140px] h-auto' : 'h-7 xl:h-8 w-auto')}
                style={{
                  filter: isTransparent ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.6)) brightness(1.15)' : undefined
                }}
                priority={false}
              />
            </Link>
          );
        }

        /* ── Regular link with underline indicator ── */
        return (
          <div key={key} className={cn("relative group", isVertical ? "w-full" : "")}>
            <Link
              href={localizedHref}
              onClick={onLinkClick}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative whitespace-nowrap px-2 xl:px-3 py-2 text-[14px] xl:text-[15px] font-medium transition-colors duration-200 flex items-center gap-1 group/link',
                isVertical && 'py-3 px-4 rounded-xl text-base w-full',
                active
                  ? (isTransparent ? 'text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]' : 'text-brand-dark font-semibold')
                  : (isTransparent ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] hover:opacity-80' : 'text-text-base hover:text-brand-dark'),
                isVertical && active && 'bg-brand-mint/20',
                isVertical && !active && 'hover:bg-brand-mint/10',
              )}
            >
              {label}

              {dropdown && !isVertical && (
                <svg className="w-3.5 h-3.5 opacity-70 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              )}

              {/* Underline indicator (horizontal only) */}
              {!isVertical && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-200',
                    isTransparent ? 'bg-white' : 'bg-brand-dark',
                    active ? 'w-[70%] opacity-100' : 'w-0 opacity-0 group-hover/link:w-[40%] group-hover/link:opacity-40',
                  )}
                />
              )}
            </Link>

            {/* Dropdown Menu (Desktop) */}
            {dropdown && !isVertical && (
              <div className="absolute top-full start-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-xl shadow-card border border-border py-2 min-w-[260px] flex flex-col">
                  {dropdown.map((dropItem) => (
                    <Link
                      key={dropItem.key}
                      href={getLocalizedPath(dropItem.href, locale)}
                      onClick={onLinkClick}
                      className="px-4 py-2.5 text-sm font-medium text-text-muted hover:text-brand-dark hover:bg-surface-light transition-colors"
                    >
                      {t.nav[dropItem.key] as string}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Dropdown */}
            {dropdown && isVertical && (
              <div className="flex flex-col ps-4 mt-1 space-y-1 border-s-2 border-border/50 ms-2">
                {dropdown.map((dropItem) => (
                  <Link
                    key={dropItem.key}
                    href={getLocalizedPath(dropItem.href, locale)}
                    onClick={onLinkClick}
                    className="px-4 py-2 text-sm font-medium text-text-muted hover:text-brand-dark hover:bg-brand-mint/10 rounded-lg transition-colors"
                  >
                    {t.nav[dropItem.key] as string}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
