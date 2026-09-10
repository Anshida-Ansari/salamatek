'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath, cn } from '@/lib/utils';
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
          className="fixed inset-0 z-40 bg-brand-dark/60 backdrop-blur-sm lg:hidden"
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
          'fixed inset-y-0 z-50 w-80 max-w-[90vw] bg-white shadow-2xl lg:hidden',
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
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Navigation
            locale={locale}
            t={t}
            orientation="vertical"
            onLinkClick={onClose}
          />
        </div>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-border space-y-3">
          <Link
            href={getLocalizedPath('/contact', locale)}
            onClick={onClose}
            className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-dark transition-colors"
          >
            {t.nav.bookAppointment}
          </Link>
          <LanguageSwitcher currentLocale={locale} variant="mobile" />
        </div>
      </div>
    </>
  );
}
