import mongoose, { Schema, Document } from 'mongoose';

export interface IInsurancePartnerDocument extends Document {
  name: string;
  image: string;
  order: number;
  active: boolean;
  isCustom?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const insurancePartnerSchema = new Schema(
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
insurancePartnerSchema.index({ active: 1, order: 1 });
insurancePartnerSchema.index({ createdAt: -1 });

export const InsurancePartner = mongoose.model<IInsurancePartnerDocument>('InsurancePartner', insurancePartnerSchema);
