import { Request, Response } from 'express';
import { HealthPackage } from '../models/HealthPackage';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getHealthPackages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.active !== undefined) {
    filter.active = req.query.active === 'true';
  }
  if (req.query.featured !== undefined) {
    filter.featured = req.query.featured === 'true';
  }
  if (req.query.search) {
    filter.$or = [
      { 'title.en': { $regex: req.query.search, $options: 'i' } },
      { 'title.ar': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    HealthPackage.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    HealthPackage.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getHealthPackageById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const hp = await HealthPackage.findById(req.params.id).lean();
  if (!hp) {
    const error = new Error('Health Package not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: hp });
});

export const getHealthPackageBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug as string;
  const healthPackage = await HealthPackage.findOne({ slug }).lean();
  if (!healthPackage) {
    const error = new Error('Health package not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: healthPackage });
});

export const createHealthPackage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const hp = await HealthPackage.create(req.body);
  res.status(201).json({ success: true, data: hp });
});

export const updateHealthPackage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const hp = await HealthPackage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!hp) {
    const error = new Error('Health Package not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: hp });
});

export const deleteHealthPackage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const hp = await HealthPackage.findByIdAndDelete(req.params.id);
  if (!hp) {
    const error = new Error('Health Package not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'Health Package deleted successfully' });
});
