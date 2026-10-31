import mongoose, { Schema, Document } from 'mongoose';

export interface IPageHeroSetting extends Document {
  pageKey: string;
  image?: string;
  images?: string[];
  heading?: { en: string; ar: string };
  subtext?: { en: string; ar: string };
  contactNumber?: string;
  shortLocation?: string;
  mapUrl?: string;
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
    images: [{ type: String }],
    heading: {
      en: { type: String },
      ar: { type: String },
    },
    subtext: {
      en: { type: String },
      ar: { type: String },
    },
    contactNumber: {
      type: String,
      default: '+966 55 929 3222',
      trim: true,
    },
    shortLocation: {
      type: String,
      default: 'Safwa',
      trim: true,
    },
    mapUrl: {
      type: String,
      default: 'https://maps.app.goo.gl/NCs1qV9fBLEpk9YK9?g_st=aw',
      trim: true,
    },
  },
  { timestamps: true }
);

export const PageHeroSetting = mongoose.model<IPageHeroSetting>('PageHeroSetting', pageHeroSettingSchema);
