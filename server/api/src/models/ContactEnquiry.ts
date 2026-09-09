import mongoose, { Schema, Document } from 'mongoose';

export interface IContactEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ContactEnquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContactEnquiry>('ContactEnquiry', ContactEnquirySchema);
