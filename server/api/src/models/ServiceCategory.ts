import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceCategory extends Document {
  name: { en: string; ar: string };
  slug: string;
  description?: { en: string; ar: string };
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceCategorySchema = new Schema(
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
    description: {
      en: { type: String },
      ar: { type: String },
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
serviceCategorySchema.index({ active: 1 });
serviceCategorySchema.index({ order: 1 });

export const ServiceCategory = mongoose.model<IServiceCategory>(
  'ServiceCategory',
  serviceCategorySchema
);
