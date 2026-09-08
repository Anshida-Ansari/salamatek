import { z } from 'zod';
import { bilingualStringSchema, optionalBilingualStringSchema, paginationQuerySchema, objectIdSchema } from './common.validation';

export const createServiceSchema = z.object({
  body: z.object({
    name: bilingualStringSchema,
    slug: z.string().min(1, 'Slug is required'),
    description: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    departmentId: objectIdSchema.optional(),
    active: z.boolean().optional(),
  }),
});

export const updateServiceSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: optionalBilingualStringSchema,
    slug: z.string().min(1).optional(),
    description: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    departmentId: objectIdSchema.optional(),
    active: z.boolean().optional(),
  }),
});

export const getServiceSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listServicesSchema = z.object({
  query: paginationQuerySchema.extend({
    departmentId: objectIdSchema.optional(),
  }),
});
