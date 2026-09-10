import { Request, Response } from 'express';
import { PageHeroSetting } from '../models/PageHeroSetting';
import { asyncHandler } from '../middlewares/asyncHandler';

export const getPageHeroSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const settings = await PageHeroSetting.find({}).lean();
  res.json({ success: true, data: settings });
});

export const getPageHeroSettingByKey = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const pageKey = req.params.pageKey as string;
  const setting = await PageHeroSetting.findOne({ pageKey }).lean();
  res.json({ success: true, data: setting || null });
});

export const updatePageHeroSetting = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const pageKey = req.params.pageKey as string;
  const setting = await PageHeroSetting.findOneAndUpdate(
    { pageKey },
    req.body,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ success: true, data: setting });
});
