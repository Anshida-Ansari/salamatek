/**
 * @salamatek/config
 *
 * Shared configuration constants and site metadata for the Salamatek monorepo.
 * Values will be populated from real client data in subsequent phases.
 */

// ─── Site metadata ────────────────────────────────────────────────────────────

export const SITE_NAME = {
  en: 'Salamatek Medical Centre',
  ar: 'مركز سلامتك الطبي',
} as const;

export const SITE_DESCRIPTION = {
  en: 'Your trusted healthcare partner',
  ar: 'شريكك الموثوق في الرعاية الصحية',
} as const;

// ─── Supported locales ────────────────────────────────────────────────────────

export const LOCALES = ['en', 'ar'] as const;
export const DEFAULT_LOCALE = 'en' as const;

// ─── API ──────────────────────────────────────────────────────────────────────

export const API_VERSION = 'v1' as const;

export const API_ROUTES = {
  HEALTH: `/api/${API_VERSION}/health`,
} as const;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DEPARTMENTS: '/departments',
  SERVICES: '/services',
  DOCTORS: '/doctors',
  PACKAGES: '/health-packages',
  SARC: '/sarc',
  CAREERS: '/careers',
  NEWS: '/news',
  CONTACT: '/contact',
} as const;
