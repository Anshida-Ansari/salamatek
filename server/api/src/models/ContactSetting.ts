import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomContactField {
  key: string;
  labelEn: string;
  labelAr: string;
  value: string;
  type?: 'phone' | 'email' | 'url' | 'text';
}

export interface IContactSetting extends Document {
  key: string;
  // Phone numbers
  phone: string;
  emergencyPhone?: string;
  additionalPhones: string[];

  // WhatsApp
  whatsappNumber: string;
  whatsappDisplay?: string;

  // Opticals contact
  opticalsPhone?: string;
  opticalsShortLocation?: string;
  opticalsMapUrl?: string;

  // Email
  email: string;
  additionalEmails: string[];

  // Address & Location
  address: string;
  addressAr?: string;
  shortLocation?: string;
  shortLocationAr?: string;
  mapsLink: string;
  mapsEmbedUrl?: string;

  // Working / Emergency Hours
  workingHoursEn?: string;
  workingHoursAr?: string;

  // Social Links
  social: {
    instagram?: string;
    snapchat?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };

  // Dynamic Custom Fields for future extensibility
  customFields: ICustomContactField[];

  updatedAt: Date;
}

const contactSettingSchema = new Schema<IContactSetting>(
  {
    key: {
      type: String,
      default: 'global',
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '013 664 2193',
      trim: true,
    },
    emergencyPhone: {
      type: String,
      default: '+966 53 296 3521',
      trim: true,
    },
    additionalPhones: {
      type: [String],
      default: ['+966 55 740 0450', '+966 55 350 4004'],
    },
    whatsappNumber: {
      type: String,
      default: '966532963521',
      trim: true,
    },
    whatsappDisplay: {
      type: String,
      default: '+966 53 296 3521',
      trim: true,
    },
    opticalsPhone: {
      type: String,
      default: '+966 55 929 3222',
      trim: true,
    },
    opticalsShortLocation: {
      type: String,
      default: 'Safwa',
      trim: true,
    },
    opticalsMapUrl: {
      type: String,
      default: 'https://maps.app.goo.gl/NCs1qV9fBLEpk9YK9?g_st=aw',
      trim: true,
    },
    email: {
      type: String,
      default: 'info@salamatekgroup.com',
      trim: true,
    },
    additionalEmails: {
      type: [String],
      default: [],
    },
    address: {
      type: String,
      default: 'Belal Ibn Rabah St, Safa Area، Safwa 32833, Saudi Arabia',
      trim: true,
    },
    addressAr: {
      type: String,
      default: 'شارع بلال بن رباح، حي الصفا، صفوى 32833، المملكة العربية السعودية',
      trim: true,
    },
    shortLocation: {
      type: String,
      default: 'Safwa',
      trim: true,
    },
    shortLocationAr: {
      type: String,
      default: 'صفوى',
      trim: true,
    },
    mapsLink: {
      type: String,
      default: 'https://maps.app.goo.gl/ExsLAhHJm1mrgrnj7?g_st=ac',
      trim: true,
    },
    mapsEmbedUrl: {
      type: String,
      default: '',
      trim: true,
    },
    workingHoursEn: {
      type: String,
      default: '24/7 Emergency Service',
      trim: true,
    },
    workingHoursAr: {
      type: String,
      default: 'خدمة الطوارئ 24/7',
      trim: true,
    },
    social: {
      instagram: {
        type: String,
        default: 'https://www.instagram.com/salamatek_medical?obrf=MXM0c2I0NHUxenVpbQ%3D%3D&utm_source=qr',
        trim: true,
      },
      snapchat: {
        type: String,
        default: 'https://www.snapchat.com/add/salamatekmed',
        trim: true,
      },
      facebook: { type: String, default: '', trim: true },
      linkedin: { type: String, default: '', trim: true },
      youtube: { type: String, default: '', trim: true },
      tiktok: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
    },
    customFields: [
      {
        key: { type: String, required: true },
        labelEn: { type: String, required: true },
        labelAr: { type: String, required: true },
        value: { type: String, required: true },
        type: {
          type: String,
          enum: ['phone', 'email', 'url', 'text'],
          default: 'text',
        },
      },
    ],
  },
  { timestamps: true }
);

export const ContactSetting = mongoose.model<IContactSetting>('ContactSetting', contactSettingSchema);
