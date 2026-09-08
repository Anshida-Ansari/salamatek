import { z } from 'zod';
import { bilingualStringSchema, optionalBilingualStringSchema, paginationQuerySchema, objectIdSchema, bilingualStringArraySchema } from './common.validation';

export const createDoctorSchema = z.object({
  body: z.object({
    name: bilingualStringSchema,
    slug: z.string().min(1, 'Slug is required'),
    designation: optionalBilingualStringSchema,
    departmentId: objectIdSchema,
    specialization: optionalBilingualStringSchema,
    qualification: optionalBilingualStringSchema,
    experienceYears: z.number().nonnegative().optional(),
    languages: bilingualStringArraySchema,
    bio: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    active: z.boolean().optional(),
  }),
});

export const updateDoctorSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    name: optionalBilingualStringSchema,
    slug: z.string().min(1).optional(),
    designation: optionalBilingualStringSchema,
    departmentId: objectIdSchema.optional(),
    specialization: optionalBilingualStringSchema,
    qualification: optionalBilingualStringSchema,
    experienceYears: z.number().nonnegative().optional(),
    languages: bilingualStringArraySchema,
    bio: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    active: z.boolean().optional(),
  }),
});

export const getDoctorSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const listDoctorsSchema = z.object({
  query: paginationQuerySchema.extend({
    departmentId: objectIdSchema.optional(),
  }),
});
