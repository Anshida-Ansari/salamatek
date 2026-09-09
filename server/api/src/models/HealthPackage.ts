import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthPackage extends Document {
  title: { en: string; ar: string };
  slug: string;
  description: { en: string; ar: string };
  price?: string; // Optional string to allow "Contact Us" or formatted strings like "$150"
  includedItems?: { en: string[]; ar: string[] };
  validity?: { en: string; ar: string };
  image?: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const healthPackageSchema = new Schema(
  {
    title: {
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
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    price: { type: String },
    includedItems: {
      en: [{ type: String }],
      ar: [{ type: String }],
    },
    validity: {
      en: { type: String },
      ar: { type: String },
    },
    image: { type: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
healthPackageSchema.index({ active: 1 });
healthPackageSchema.index({ featured: 1 });

export const HealthPackage = mongoose.model<IHealthPackage>('HealthPackage', healthPackageSchema);
