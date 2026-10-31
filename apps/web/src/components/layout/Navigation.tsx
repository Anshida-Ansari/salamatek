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
  optical?: boolean;
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
  { key: 'insurancePartners', href: '/insurance-partners' },
  { key: 'news',         href: '/news' },
  { key: 'gallery',      href: '/gallery' },
  { key: 'sarc',         href: '/sarc', sarc: true },
  { key: 'opticalBrands',href: '/optical-brands', optical: true },
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
        isVertical ? 'flex flex-col gap-1' : 'flex items-center gap-0.5 xl:gap-1.5',
        className,
      )}
    >
      {NAV_ITEMS.map(({ key, href, sarc, optical, dropdown }) => {
        const localizedHref = getLocalizedPath(href, locale);
        const active = isActive(href);
        const label = t.nav[key] as string;

        /* ── SARC logo link / mobile button ── */
        if (sarc) {
          if (isVertical) {
            return (
              <Link
                key={key}
                href={localizedHref}
                onClick={onLinkClick}
                aria-label="SARC — Industrial Healthcare"
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-border shadow-xs hover:border-brand-medium/60 hover:shadow-sm transition-all duration-200 mt-2.5',
                  active && 'border-brand-medium bg-brand-mint/20 ring-1 ring-brand-medium/20',
                )}
                dir="ltr"
              >
                <div className="flex items-center justify-start h-8 shrink-0">
                  <Image
                    src="/images/sarc-logo-transparent.png"
                    alt="SARC"
                    width={72}
                    height={32}
                    className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                    priority
                  />
                </div>
                <span className="text-sm font-semibold text-brand-dark group-hover:text-brand transition-colors">
                  {locale === 'ar' ? 'سارك' : 'SARC'}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={key}
              href={localizedHref}
              onClick={onLinkClick}
              aria-label="SARC — Industrial Healthcare"
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative inline-flex items-center justify-center shrink-0 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm px-1 xl:px-1.5 py-1',
                active && 'opacity-90',
              )}
            >
              <Image
                src="/images/sarc-logo-transparent.png"
                alt="SARC"
                width={120}
                height={40}
                className="object-contain transition-transform hover:scale-105 shrink-0"
                style={{
                  width: 'auto',
                  height: '30px',
                  maxHeight: '30px',
                  filter: isTransparent ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.6)) brightness(1.15)' : undefined,
                }}
                priority
              />
            </Link>
          );
        }

        /* ── Optical logo link / mobile button ── */
        if (optical) {
          if (isVertical) {
            return (
              <Link
                key={key}
                href={localizedHref}
                onClick={onLinkClick}
                aria-label={locale === 'ar' ? 'سلامتك للبصريات' : 'Salamatek Opticals'}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-border shadow-xs hover:border-brand-medium/60 hover:shadow-sm transition-all duration-200 mt-2',
                  active && 'border-brand-medium bg-brand-mint/20 ring-1 ring-brand-medium/20',
                )}
                dir="ltr"
              >
                <div className="flex items-center justify-start h-8 shrink-0">
                  <Image
                    src="/images/salamatek-opticals-logo.png"
                    alt="Salamatek Opticals"
                    width={72}
                    height={38}
                    className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
                    priority
                    suppressHydrationWarning
                  />
                </div>
                <span className="text-sm font-semibold text-brand-dark group-hover:text-brand transition-colors">
                  {locale === 'ar' ? 'سلامتك للبصريات' : 'Salamatek Opticals'}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={key}
              href={localizedHref}
              onClick={onLinkClick}
              aria-label={label || 'Salamatek Opticals'}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative inline-flex items-center justify-center shrink-0 transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm px-1 xl:px-1.5 py-1',
                active && 'opacity-90',
              )}
            >
              <Image
                src="/images/salamatek-opticals-logo.png"
                alt="Salamatek Opticals"
                width={100}
                height={54}
                className="object-contain transition-transform hover:scale-105 shrink-0"
                style={{
                  width: 'auto',
                  height: '30px',
                  maxHeight: '30px',
                  filter: isTransparent ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.6)) brightness(1.15)' : undefined,
                }}
                priority
                suppressHydrationWarning
              />
            </Link>
          );
        }

        /* ── Regular link with underline indicator ── */
        return (
          <div key={key} className={cn("relative group shrink-0", isVertical ? "w-full" : "")}>
            <Link
              href={localizedHref}
              onClick={() => {
                if (key === 'packages') {
                  window.dispatchEvent(new CustomEvent('open-promo-popup'));
                }
                onLinkClick?.();
              }}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative whitespace-nowrap px-1.5 xl:px-2 py-1.5 text-[13px] xl:text-[14px] font-medium transition-colors duration-200 flex items-center gap-0.5 group/link',
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
                <svg className="w-3 h-3 opacity-70 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
