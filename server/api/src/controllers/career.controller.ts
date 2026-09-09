import { Request, Response } from 'express';
import { Career } from '../models/Career';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getCareers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.active !== undefined) {
    filter.active = req.query.active === 'true';
  }
  if (req.query.search) {
    filter.$or = [
      { 'title.en': { $regex: req.query.search, $options: 'i' } },
      { 'title.ar': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Career.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Career.countDocuments(filter),
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

export const getCareerById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const career = await Career.findById(req.params.id).lean();
  if (!career) {
    const error = new Error('Career not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: career });
});

export const getCareerBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const career = await Career.findOne({ slug: req.params.slug }).lean();
  if (!career) {
    const error = new Error('Career not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: career });
});

export const createCareer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const career = await Career.create(req.body);
  res.status(201).json({ success: true, data: career });
});

export const updateCareer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!career) {
    const error = new Error('Career not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: career });
});

export const deleteCareer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const career = await Career.findByIdAndDelete(req.params.id);
  if (!career) {
    const error = new Error('Career not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'Career deleted successfully' });
});
