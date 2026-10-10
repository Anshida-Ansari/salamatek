'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
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

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-card">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="flex items-center justify-between h-20">

            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Logo locale={locale} size="md" type="horizontal" isTransparent={false} />
            </div>

            {/* Center: Desktop Nav */}
            <div className="hidden xl:flex flex-1 justify-center min-w-0 px-4">
              <Navigation locale={locale} t={t} isTransparent={false} />
            </div>

            {/* Right: Desktop Right Actions */}
            <div className="hidden xl:flex items-center gap-4 flex-shrink-0">

              <LanguageSwitcher currentLocale={locale} isTransparent={false} />

              <div
                className="h-5 w-px bg-border"
                aria-hidden="true"
              />

              {/* Accreditation Group */}
              <div className="flex items-center gap-4">
                <Image
                  src="/images/cbahi-logo-transparent.png"
                  alt="CBAHI Accredited"
                  width={80}
                  height={32}
                  className="h-7 xl:h-8 w-auto object-contain"
                  priority={false}
                />

                <Image
                  src="/images/24-7-logo-transparent.png"
                  alt="24/7 Service"
                  width={80}
                  height={40}
                  className="h-7 xl:h-8 w-auto object-contain"
                  priority={false}
                />
              </div>

            </div>

            {/* Mobile Actions */}
            <div className="flex xl:hidden items-center gap-3">
              <LanguageSwitcher currentLocale={locale} isTransparent={false} />

              {/* Mobile Hamburger */}
              <button
                onClick={openMenu}
                aria-label={t.nav.openMenu}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg transition-colors text-text-muted hover:text-text-base hover:bg-surface-mint"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
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
