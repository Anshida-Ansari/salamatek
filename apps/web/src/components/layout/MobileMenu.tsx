'use client';

import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Navigation } from './Navigation';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  t: Translations;
};

export function MobileMenu({ isOpen, onClose, locale, t }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      firstFocusableRef.current?.focus();
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-dark/60 backdrop-blur-sm xl:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed inset-y-0 z-50 w-80 max-w-[90vw] bg-white shadow-2xl xl:hidden',
          'flex flex-col transition-transform duration-300 ease-in-out',
          locale === 'ar' ? 'left-0' : 'right-0',
          isOpen
            ? 'translate-x-0'
            : locale === 'ar' ? '-translate-x-full' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="font-semibold text-text-base">Menu</p>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="p-2 rounded-lg text-text-muted hover:text-text-base hover:bg-surface-mint transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav Links — reuse Navigation in vertical mode */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <Navigation
            locale={locale}
            t={t}
            orientation="vertical"
            onLinkClick={onClose}
          />
          <div className="px-4 mt-6 mb-2">
            <div className="flex items-center gap-6">
              <Image
                src="/images/cbahi-logo-transparent.png"
                alt="CBAHI Accredited"
                width={100}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <Image
                src="/images/24-7-logo-transparent.png"
                alt="24/7 Service"
                width={80}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-border space-y-3">
          <a
            href="https://wa.me/966532963521?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20booking%20an%20appointment%20at%20Salamatek%20Medical%20Centre."
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe5c] transition-colors"
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.827L0 24l6.341-1.499A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 01-5.003-1.366l-.359-.213-3.764.89.952-3.664-.234-.376A9.787 9.787 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182c5.428 0 9.818 4.391 9.818 9.818 0 5.428-4.39 9.818-9.818 9.818z"/>
            </svg>
            {locale === 'ar' ? 'استفسار عن موعد' : 'Appointment Enquiry'}
          </a>
          <LanguageSwitcher currentLocale={locale} variant="mobile" />
        </div>
      </div>
    </>
  );
}
