import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: { en: string; ar: string };
  slug: string;
  excerpt: { en: string; ar: string };
  content: { en: string; ar: string };
  author?: { en: string; ar: string };
  category?: { en: string; ar: string };
  image?: string;
  publishedDate: Date;
  status: 'draft' | 'published';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new Schema(
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
    excerpt: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    content: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    author: {
      en: { type: String },
      ar: { type: String },
    },
    category: {
      en: { type: String },
      ar: { type: String },
    },
    image: { type: String },
    publishedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
newsSchema.index({ status: 1 });
newsSchema.index({ featured: 1 });
newsSchema.index({ publishedDate: -1 });

export const News = mongoose.model<INews>('News', newsSchema);
