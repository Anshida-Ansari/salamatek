import { z } from 'zod';
import { bilingualStringSchema, optionalBilingualStringSchema, paginationQuerySchema, objectIdSchema } from './common.validation';

export const createTestimonialSchema = z.object({
  body: z.object({
    name: bilingualStringSchema,
    rating: z.number().min(1).max(5).optional().default(5),
    text: bilingualStringSchema,
    date: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

export const updateTestimonialSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: optionalBilingualStringSchema,
    rating: z.number().min(1).max(5).optional(),
    text: optionalBilingualStringSchema,
    date: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

export const getTestimonialSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listTestimonialsSchema = z.object({
  query: paginationQuerySchema,
});
