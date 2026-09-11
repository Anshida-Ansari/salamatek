import mongoose, { Schema, Document } from 'mongoose';

export interface IPageHeroSetting extends Document {
  pageKey: string;
  image?: string;
  heading?: { en: string; ar: string };
  subtext?: { en: string; ar: string };
  updatedAt: Date;
}

const pageHeroSettingSchema = new Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: { type: String },
    heading: {
      en: { type: String },
      ar: { type: String },
    },
    subtext: {
      en: { type: String },
      ar: { type: String },
    },
  },
  { timestamps: true }
);



export const PageHeroSetting = mongoose.model<IPageHeroSetting>('PageHeroSetting', pageHeroSettingSchema);
