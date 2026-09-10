import { z } from 'zod';
import { bilingualStringSchema, optionalBilingualStringSchema, paginationQuerySchema, objectIdSchema } from './common.validation';

export const createDepartmentSchema = z.object({
  body: z.object({
    name: bilingualStringSchema,
    slug: z.string().min(1, 'Slug is required'),
    subheading: optionalBilingualStringSchema,
    description: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    active: z.boolean().optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: optionalBilingualStringSchema,
    slug: z.string().min(1).optional(),
    subheading: optionalBilingualStringSchema,
    description: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    active: z.boolean().optional(),
  }),
});

export const getDepartmentSchema = z.object({
  params: z.object({
    id: objectIdSchema, // Can also be slug, we'll handle slug dynamically in controller, so just leave this for ID
  }),
});

export const listDepartmentsSchema = z.object({
  query: paginationQuerySchema,
});
