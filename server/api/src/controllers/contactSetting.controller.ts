import { Request, Response } from 'express';
import { ContactSetting } from '../models/ContactSetting';
import { asyncHandler } from '../middlewares/asyncHandler';

const DEFAULT_SETTINGS = {
  key: 'global',
  phone: '013 664 2193',
  emergencyPhone: '+966 53 296 3521',
  additionalPhones: ['+966 55 740 0450', '+966 55 350 4004'],
  whatsappNumber: '966532963521',
  whatsappDisplay: '+966 53 296 3521',
  opticalsPhone: '+966 55 929 3222',
  opticalsShortLocation: 'Safwa',
  opticalsMapUrl: 'https://maps.app.goo.gl/NCs1qV9fBLEpk9YK9?g_st=aw',
  email: 'info@salamatekgroup.com',
  additionalEmails: [],
  address: 'Belal Ibn Rabah St, Safa Area، Safwa 32833, Saudi Arabia',
  addressAr: 'شارع بلال بن رباح، حي الصفا، صفوى 32833، المملكة العربية السعودية',
  shortLocation: 'Safwa',
  shortLocationAr: 'صفوى',
  mapsLink: 'https://maps.app.goo.gl/ExsLAhHJm1mrgrnj7?g_st=ac',
  mapsEmbedUrl: '',
  workingHoursEn: '24/7 Emergency Service',
  workingHoursAr: 'خدمة الطوارئ 24/7',
  social: {
    instagram: 'https://www.instagram.com/salamatek_medical?obrf=MXM0c2I0NHUxenVpbQ%3D%3D&utm_source=qr',
    snapchat: 'https://www.snapchat.com/add/salamatekmed',
    facebook: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    twitter: '',
  },
  customFields: [],
};

export const getContactSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  let settings = await ContactSetting.findOne({ key: 'global' }).lean();

  if (!settings) {
    // Upsert default settings document if not present
    const created = await ContactSetting.findOneAndUpdate(
      { key: 'global' },
      { $setOnInsert: DEFAULT_SETTINGS },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    settings = created;
  }

  res.json({
    success: true,
    data: settings || DEFAULT_SETTINGS,
  });
});

export const updateContactSettings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const allowedUpdates = { ...req.body };
  delete allowedUpdates._id;
  delete allowedUpdates.key;
  delete allowedUpdates.createdAt;
  delete allowedUpdates.updatedAt;

  const settings = await ContactSetting.findOneAndUpdate(
    { key: 'global' },
    { $set: allowedUpdates },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  res.json({
    success: true,
    data: settings,
    message: 'Global contact settings updated successfully',
  });
});

