import mongoose, { Schema, Document } from 'mongoose';

export interface ICareer extends Document {
  title: { en: string; ar: string };
  slug: string;
  department: { en: string; ar: string };
  location: { en: string; ar: string };
  employmentType: { en: string; ar: string };
  experience: { en: string; ar: string };
  description: { en: string; ar: string };
  requirements: { en: string[]; ar: string[] };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const careerSchema = new Schema(
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
    department: {
      en: { type: String },
      ar: { type: String },
    },
    location: {
      en: { type: String },
      ar: { type: String },
    },
    employmentType: {
      en: { type: String },
      ar: { type: String },
    },
    experience: {
      en: { type: String },
      ar: { type: String },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    requirements: {
      en: [{ type: String }],
      ar: [{ type: String }],
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
careerSchema.index({ active: 1 });

export const Career = mongoose.model<ICareer>('Career', careerSchema);
