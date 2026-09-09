import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: { en: string; ar: string };
  slug: string;
  description?: { en: string; ar: string };
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    description: {
      en: { type: String },
      ar: { type: String },
    },
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
departmentSchema.index({ active: 1 });

export const Department = mongoose.model<IDepartment>('Department', departmentSchema);
