/**
 * @salamatek/types
 *
 * Shared TypeScript type definitions for the Salamatek monorepo.
 * Business-domain types will be added in subsequent phases.
 */

// ─── Common ──────────────────────────────────────────────────────────────────

export type Locale = 'en' | 'ar';

export type LocalizedString = {
  en: string;
  ar: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    message: string;
    code?: string;
  };
};

// ─── Health ──────────────────────────────────────────────────────────────────

export type HealthCheckResponse = {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  environment: string;
};

// ─── Testimonials ────────────────────────────────────────────────────────────

export interface ITestimonial {
  _id: string;
  name: { en: string; ar: string };
  rating: number;
  text: { en: string; ar: string };
  date?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}