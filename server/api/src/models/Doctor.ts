import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  name: { en: string; ar: string };
  slug: string;
  designation?: { en: string; ar: string };
  departmentId: Types.ObjectId;
  specialization?: { en: string; ar: string };
  qualification?: { en: string; ar: string };
  experienceYears?: number;
  languages?: { en: string[]; ar: string[] };
  bio?: { en: string; ar: string };
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema(
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
    designation: {
      en: { type: String },
      ar: { type: String },
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    specialization: {
      en: { type: String },
      ar: { type: String },
    },
    qualification: {
      en: { type: String },
      ar: { type: String },
    },
    experienceYears: { type: Number },
    languages: {
      en: [{ type: String }],
      ar: [{ type: String }],
    },
    bio: {
      en: { type: String },
      ar: { type: String },
    },
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
doctorSchema.index({ slug: 1 });
doctorSchema.index({ active: 1 });
doctorSchema.index({ departmentId: 1 });

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);
