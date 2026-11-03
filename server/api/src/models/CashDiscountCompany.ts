import mongoose, { Schema, Document } from 'mongoose';

export interface ICashDiscountCompanyDocument extends Document {
  name?: string;
  image: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cashDiscountCompanySchema = new Schema(
  {
    name: { type: String, default: '', trim: true },
    image: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
cashDiscountCompanySchema.index({ active: 1, order: 1 });
cashDiscountCompanySchema.index({ createdAt: -1 });

export const CashDiscountCompany = mongoose.model<ICashDiscountCompanyDocument>(
  'CashDiscountCompany',
  cashDiscountCompanySchema
);

