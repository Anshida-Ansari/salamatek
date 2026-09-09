import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const bilingualStringSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  ar: z.string().min(1, 'Arabic text is required'),
});

export const optionalBilingualStringSchema = z.object({
  en: z.string().optional(),
  ar: z.string().optional(),
}).optional();

export const bilingualStringArraySchema = z.object({
  en: z.array(z.string()),
  ar: z.array(z.string()),
}).optional();

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional().transform(Number),
  limit: z.string().regex(/^\d+$/).optional().transform(Number),
  search: z.string().optional(),
  active: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
});
