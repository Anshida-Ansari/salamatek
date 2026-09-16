import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getTestimonials = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.active !== undefined) {
    filter.active = req.query.active === 'true';
  }
  if (req.query.search) {
    filter.$or = [
      { 'name.en': { $regex: req.query.search, $options: 'i' } },
      { 'name.ar': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Testimonial.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Testimonial.countDocuments(filter),
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

export const getTestimonialById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findById(req.params.id).lean();
  if (!testimonial) {
    const error = new Error('Testimonial not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: testimonial });
});

export const createTestimonial = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!testimonial) {
    const error = new Error('Testimonial not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    const error = new Error('Testimonial not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'Testimonial deleted successfully' });
});
