import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryImageDocument extends Document {
  imageUrl: string;
  title?: { en: string; ar: string };
  description?: { en: string; ar: string };
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const galleryImageSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    title: {
      en: { type: String },
      ar: { type: String },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for fast retrieval
galleryImageSchema.index({ active: 1, order: 1 });

export const GalleryImage = mongoose.model<IGalleryImageDocument>('GalleryImage', galleryImageSchema);
