import { z } from 'zod';
import { bilingualStringSchema, optionalBilingualStringSchema, paginationQuerySchema, objectIdSchema } from './common.validation';

const contentBlockImageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  caption: z
    .union([
      z.string().transform((str) => ({ en: str, ar: '' })),
      optionalBilingualStringSchema,
    ])
    .optional()
    .default({ en: '', ar: '' }),
});

const contentBlockItemSchema = z.union([
  z.string().transform((str) => ({ en: str, ar: '' })),
  z.object({
    en: z.string().optional().default(''),
    ar: z.string().optional().default(''),
  }),
]);

export const departmentContentBlockSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['heading_text', 'bullet_points', 'image_gallery', 'text_images']),
  heading: optionalBilingualStringSchema,
  description: optionalBilingualStringSchema,
  items: z.array(contentBlockItemSchema).optional().default([]),
  images: z.array(contentBlockImageSchema).optional().default([]),
  order: z.number().int().optional().default(0),
});

export const createDepartmentSchema = z.object({
  body: z.object({
    name: bilingualStringSchema,
    slug: z.string().min(1, 'Slug is required'),
    subheading: optionalBilingualStringSchema,
    description: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    order: z.number().int().optional(),
    active: z.boolean().optional(),
    additionalContent: z.array(departmentContentBlockSchema).optional(),
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
    order: z.number().int().optional(),
    active: z.boolean().optional(),
    additionalContent: z.array(departmentContentBlockSchema).optional(),
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
