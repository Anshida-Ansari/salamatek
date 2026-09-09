import mongoose, { Schema, Document } from 'mongoose';

export interface ISarcEnquiry extends Document {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceRequired: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const sarcEnquirySchema = new Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceRequired: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

sarcEnquirySchema.index({ status: 1 });
sarcEnquirySchema.index({ createdAt: -1 });

export const SarcEnquiry = mongoose.model<ISarcEnquiry>('SarcEnquiry', sarcEnquirySchema);
