import type { Locale } from '@/i18n/config';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getLocalizedPath(path: string, locale: Locale): string {
  return `/${locale}${path === '/' ? '' : path}`;
}

export function stripLocale(pathname: string, locales: readonly string[]): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
    if (pathname === `/${locale}`) return '/';
  }
  return pathname;
}
