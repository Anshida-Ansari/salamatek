import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IService extends Document {
  name: { en: string; ar: string };
  slug: string;
  description?: { en: string; ar: string };
  image?: string;
  departmentId?: Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema(
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
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
serviceSchema.index({ active: 1 });
serviceSchema.index({ departmentId: 1 });

export const Service = mongoose.model<IService>('Service', serviceSchema);
