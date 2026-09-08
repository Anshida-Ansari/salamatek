'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath } from '@/lib/utils';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from './LanguageSwitcher';

type Props = {
  locale: Locale;
  t: Translations;
};

export function Header({ locale, t }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMenu = useCallback((): void => setIsMobileMenuOpen(true), []);
  const closeMenu = useCallback((): void => setIsMobileMenuOpen(false), []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-card" role="banner">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Logo locale={locale} size="sm" />

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              <Navigation locale={locale} t={t} />
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher currentLocale={locale} />
              <div className="h-5 w-px bg-border" aria-hidden="true" />
              <Link
                href={getLocalizedPath('/contact', locale)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
              >
                {t.nav.bookAppointment}
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={openMenu}
              aria-label={t.nav.openMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-base hover:bg-surface-mint transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMenu}
        locale={locale}
        t={t}
      />
    </>
  );
}
