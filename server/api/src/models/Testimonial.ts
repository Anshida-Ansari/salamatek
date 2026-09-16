import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonialDocument extends Document {
  name: { en: string; ar: string };
  rating: number;
  text: { en: string; ar: string };
  date?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    text: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    date: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
testimonialSchema.index({ active: 1 });

export const Testimonial = mongoose.model<ITestimonialDocument>('Testimonial', testimonialSchema);
