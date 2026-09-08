'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import type { Translations } from '@/i18n';
import { getLocalizedPath, cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
  { key: 'about' as const,        href: '/about' },
  { key: 'departments' as const,  href: '/departments' },
  { key: 'doctors' as const,      href: '/doctors' },
  { key: 'packages' as const,     href: '/health-packages' },
  { key: 'sarc' as const,         href: '/sarc', highlight: true },
  { key: 'opticalStore' as const, href: '/optical-store' },
  { key: 'news' as const,         href: '/news' },
  { key: 'contact' as const,      href: '/contact' },
];

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

        {/* Nav Links */}
        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {NAV_ITEMS.map(({ key, href, highlight }) => {
            const localizedHref = getLocalizedPath(href, locale);
            const label = t.nav[key] as string;
            return (
              <Link
                key={key}
                href={localizedHref}
                onClick={onClose}
                className={cn(
                  'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-150',
                  highlight
                    ? 'bg-brand-orange text-white font-bold hover:bg-brand-orange-dark'
                    : 'text-text-base hover:bg-brand-mint hover:text-brand-dark',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5 border-t border-border space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={onClose}
          >
            {t.nav.bookAppointment}
          </Button>
          <LanguageSwitcher currentLocale={locale} variant="mobile" />
        </div>
      </div>
    </>
  );
}
