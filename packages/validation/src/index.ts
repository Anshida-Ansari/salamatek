/**
 * @salamatek/validation
 *
 * Shared Zod validation schemas for the Salamatek monorepo.
 * Domain-specific schemas will be added in subsequent phases.
 */

export { z } from 'zod';

// ─── Common schemas ───────────────────────────────────────────────────────────

import { z } from 'zod';

export const LocaleSchema = z.enum(['en', 'ar']);

export const LocalizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
