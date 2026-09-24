'use client';

import { useState, useCallback, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openMenu = useCallback((): void => setIsMobileMenuOpen(true), []);
  const closeMenu = useCallback((): void => setIsMobileMenuOpen(false), []);

  const isTransparent = !isScrolled;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white border-b border-border shadow-card' : 'bg-transparent border-transparent'
        }`}
        role="banner"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16 lg:h-18' : 'h-20 lg:h-24'}`}>

            {/* Logo */}
            <Logo locale={locale} size="md" type="horizontal" isTransparent={isTransparent} />

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-2 xl:gap-4 flex-1 justify-center xl:justify-center">
              <Navigation locale={locale} t={t} isTransparent={isTransparent} />
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">

              {/* Language Switcher — leftmost */}
              <LanguageSwitcher currentLocale={locale} isTransparent={isTransparent} />

              {/* Divider */}
              <div
                className={`h-5 w-px mx-1 transition-colors duration-300 ${isTransparent ? 'bg-white/30' : 'bg-border'}`}
                aria-hidden="true"
              />

              {/* CBAHI Logo (not clickable) */}
              <div className="flex items-center select-none">
                <Image
                  src="/images/cbahi-logo-transparent.png"
                  alt="CBAHI Accredited"
                  width={80}
                  height={32}
                  className="w-16 lg:w-20 h-auto object-contain"
                  style={isTransparent ? { filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' } : undefined}
                  priority={false}
                />
              </div>

              {/* 24/7 Logo */}
              <div className="flex items-center select-none">
                <Image
                  src="/images/24-7-logo-transparent.png"
                  alt="24/7 Service"
                  width={80}
                  height={40}
                  className="w-12 lg:w-16 h-auto object-contain"
                  style={isTransparent ? { filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5)) brightness(1.2)' } : undefined}
                  priority={false}
                />
              </div>

            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={openMenu}
              aria-label={t.nav.openMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className={`xl:hidden p-2 rounded-lg transition-colors ${
                isTransparent
                  ? 'text-white hover:bg-white/20'
                  : 'text-text-muted hover:text-text-base hover:bg-surface-mint'
              }`}
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
