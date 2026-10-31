import mongoose, { Schema, Document } from 'mongoose';

export interface IOpticalBrandDocument extends Document {
  name: string;
  image: string;
  order: number;
  active: boolean;
  isCustom?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const opticalBrandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
opticalBrandSchema.index({ active: 1, order: 1 });
opticalBrandSchema.index({ createdAt: -1 });

export const OpticalBrand = mongoose.model<IOpticalBrandDocument>('OpticalBrand', opticalBrandSchema);
