import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  careerId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl: string;
  status: 'new' | 'reviewed' | 'rejected' | 'hired';
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema(
  {
    careerId: {
      type: Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    coverLetter: { type: String },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'rejected', 'hired'],
      default: 'new',
    },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ careerId: 1 });
jobApplicationSchema.index({ status: 1 });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
