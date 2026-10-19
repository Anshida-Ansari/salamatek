import { z } from 'zod';
import {
  bilingualStringSchema,
  optionalBilingualStringSchema,
  paginationQuerySchema,
  objectIdSchema,
} from './common.validation';

export const createServiceCategorySchema = z.object({
  body: z.object({
    name: bilingualStringSchema,
    slug: z.string().min(1, 'Slug is required'),
    description: optionalBilingualStringSchema,
    order: z.number().optional(),
    active: z.boolean().optional(),
  }),
});

export const updateServiceCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: optionalBilingualStringSchema,
    slug: z.string().min(1).optional(),
    description: optionalBilingualStringSchema,
    order: z.number().optional(),
    active: z.boolean().optional(),
  }),
});

export const getServiceCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listServiceCategoriesSchema = z.object({
  query: paginationQuerySchema.extend({
    // allow extra query options if needed
  }),
});
