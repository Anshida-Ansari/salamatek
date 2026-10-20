'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from './LanguageSwitcher';

import { contactConfig } from '@/config/contact';

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
            <div className="hidden xl:flex items-center gap-3.5 flex-shrink-0">

              {/* Social Channels: WhatsApp, Instagram, Snapchat */}
              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${contactConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all shadow-sm"
                  aria-label="WhatsApp"
                  title="WhatsApp (+966 53 296 3521)"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.827L0 24l6.341-1.499A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.366l-.359-.213-3.764.89.952-3.664-.234-.376A9.787 9.787 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182c5.428 0 9.818 4.391 9.818 9.818 0 5.428-4.39 9.818-9.818 9.818z"/>
                  </svg>
                </a>

                <a
                  href={contactConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>

                <a
                  href={contactConfig.social.snapchat}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-amber-50 hover:bg-[#FFFC00] text-amber-600 hover:text-black flex items-center justify-center transition-all shadow-sm"
                  aria-label="Snapchat"
                  title="Snapchat"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.25c-3.6 0-5.75 2.5-5.75 5.8 0 .85.18 1.7.42 2.38-.63.2-1.63.6-1.87 1.52-.15.57.13 1.1.68 1.31.1.04.23.07.37.09-.16.37-.44.86-.94 1.15-.56.31-1.01.26-1.25.67-.18.3-.05.68.3 1.03.59.57 1.41.74 2.3.82.24.02.45.15.56.36.3.61.77 1.16 1.79 1.3.49.07 1.12-.05 1.74-.24.42-.13.86-.13 1.28 0 .61.19 1.24.31 1.73.24 1.02-.14 1.49-.69 1.79-1.3.11-.21.32-.34.56-.36.89-.08 1.71-.25 2.3-.82.35-.35.48-.73.3-1.03-.24-.41-.69-.36-1.25-.67-.5-.29-.78-.78-.94-1.15.14-.02.27-.05.37-.09.55-.21.83-.74.68-1.31-.24-.92-1.24-1.32-1.87-1.52.24-.68.42-1.53.42-2.38 0-3.3-2.15-5.8-5.75-5.8z" />
                  </svg>
                </a>
              </div>

              <div
                className="h-5 w-px bg-border"
                aria-hidden="true"
              />

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
