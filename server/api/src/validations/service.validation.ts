import { z } from 'zod';
import { bilingualStringSchema, optionalBilingualStringSchema, paginationQuerySchema, objectIdSchema } from './common.validation';

export const createServiceSchema = z.object({
  body: z.object({
    name: bilingualStringSchema,
    slug: z.string().min(1, 'Slug is required'),
    categoryId: objectIdSchema.optional().nullable(),
    description: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    associatedOrganizations: z.array(z.string()).optional(),
    departmentId: objectIdSchema.optional().nullable(),
    order: z.number().optional(),
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
    categoryId: objectIdSchema.optional().nullable(),
    description: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    associatedOrganizations: z.array(z.string()).optional(),
    departmentId: objectIdSchema.optional().nullable(),
    order: z.number().optional(),
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
    categoryId: objectIdSchema.optional(),
  }),
});
