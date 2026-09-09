import { z } from 'zod';
import { 
  objectIdSchema, 
  bilingualStringSchema, 
  optionalBilingualStringSchema, 
  bilingualStringArraySchema, 
  paginationQuerySchema 
} from './common.validation';

// HealthPackage
export const createHealthPackageSchema = z.object({
  body: z.object({
    title: bilingualStringSchema,
    slug: z.string().min(1),
    description: bilingualStringSchema,
    price: z.string().optional().or(z.literal('')),
    includedItems: bilingualStringArraySchema,
    validity: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
  }),
});

export const updateHealthPackageSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    title: optionalBilingualStringSchema,
    slug: z.string().min(1).optional(),
    description: optionalBilingualStringSchema,
    price: z.string().optional().or(z.literal('')),
    includedItems: bilingualStringArraySchema,
    validity: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().optional(),
    active: z.boolean().optional(),
  }),
});

// Career
export const createCareerSchema = z.object({
  body: z.object({
    title: bilingualStringSchema,
    slug: z.string().min(1),
    department: optionalBilingualStringSchema,
    location: optionalBilingualStringSchema,
    employmentType: optionalBilingualStringSchema,
    experience: optionalBilingualStringSchema,
    description: bilingualStringSchema,
    requirements: bilingualStringArraySchema,
    active: z.boolean().optional(),
  }),
});

export const updateCareerSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    title: optionalBilingualStringSchema,
    slug: z.string().min(1).optional(),
    department: optionalBilingualStringSchema,
    location: optionalBilingualStringSchema,
    employmentType: optionalBilingualStringSchema,
    experience: optionalBilingualStringSchema,
    description: optionalBilingualStringSchema,
    requirements: bilingualStringArraySchema,
    active: z.boolean().optional(),
  }),
});

// Job Application
export const createJobApplicationSchema = z.object({
  body: z.object({
    careerId: objectIdSchema,
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    coverLetter: z.string().optional().or(z.literal('')),
    resumeUrl: z.string().url(),
  }),
});

export const updateJobApplicationStatusSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    status: z.enum(['new', 'reviewed', 'rejected', 'hired']),
  }),
});

// News
export const createNewsSchema = z.object({
  body: z.object({
    title: bilingualStringSchema,
    slug: z.string().min(1),
    excerpt: bilingualStringSchema,
    content: bilingualStringSchema,
    author: optionalBilingualStringSchema,
    category: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    publishedDate: z.string().datetime().optional().or(z.date().optional()),
    status: z.enum(['draft', 'published']).optional(),
    featured: z.boolean().optional(),
  }),
});

export const updateNewsSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    title: optionalBilingualStringSchema,
    slug: z.string().min(1).optional(),
    excerpt: optionalBilingualStringSchema,
    content: optionalBilingualStringSchema,
    author: optionalBilingualStringSchema,
    category: optionalBilingualStringSchema,
    image: z.string().url().optional().or(z.literal('')),
    publishedDate: z.string().datetime().optional().or(z.date().optional()),
    status: z.enum(['draft', 'published']).optional(),
    featured: z.boolean().optional(),
  }),
});

// Sarc Enquiry
export const createSarcEnquirySchema = z.object({
  body: z.object({
    companyName: z.string().min(1),
    contactPerson: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    serviceRequired: z.string().min(1),
    message: z.string().optional().or(z.literal('')),
  }),
});

export const updateSarcEnquiryStatusSchema = z.object({
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    status: z.enum(['new', 'contacted', 'closed']),
  }),
});

// Common generic schemas
export const getByIdSchema = z.object({
  params: z.object({ id: objectIdSchema }),
});

export const listSchema = z.object({
  query: paginationQuerySchema.extend({
    active: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
    featured: z.enum(['true', 'false']).optional().transform((val) => val === 'true'),
    status: z.enum(['draft', 'published', 'new', 'contacted', 'closed', 'reviewed', 'rejected', 'hired']).optional(),
    search: z.string().optional(),
    careerId: objectIdSchema.optional(),
  }),
});
