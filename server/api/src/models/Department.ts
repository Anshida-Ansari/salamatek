import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartmentContentBlock {
  id?: string;
  type: 'heading_text' | 'bullet_points' | 'image_gallery' | 'text_images';
  heading?: { en?: string; ar?: string };
  description?: { en?: string; ar?: string };
  items?: Array<{ en?: string; ar?: string }>;
  images?: Array<{ url: string; caption?: { en?: string; ar?: string } }>;
  order?: number;
}

export interface IDepartment extends Document {
  name: { en: string; ar: string };
  slug: string;
  subheading?: { en: string; ar: string };
  description?: { en: string; ar: string };
  image?: string;
  order?: number;
  active: boolean;
  additionalContent?: IDepartmentContentBlock[];
  createdAt: Date;
  updatedAt: Date;
}

const contentBlockImageSchema = new Schema(
  {
    url: { type: String, required: true },
    caption: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' },
    },
  },
  { _id: false }
);

const contentBlockItemSchema = new Schema(
  {
    en: { type: String, default: '' },
    ar: { type: String, default: '' },
  },
  { _id: false }
);

const departmentContentBlockSchema = new Schema(
  {
    id: { type: String },
    type: {
      type: String,
      enum: ['heading_text', 'bullet_points', 'image_gallery', 'text_images'],
      required: true,
    },
    heading: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' },
    },
    description: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' },
    },
    items: {
      type: [contentBlockItemSchema],
      default: [],
    },
    images: {
      type: [contentBlockImageSchema],
      default: [],
    },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const departmentSchema = new Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subheading: {
      en: { type: String },
      ar: { type: String },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    image: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    additionalContent: {
      type: [departmentContentBlockSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes
departmentSchema.index({ active: 1 });
departmentSchema.index({ order: 1 });

export const Department = mongoose.model<IDepartment>('Department', departmentSchema);
