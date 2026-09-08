import { Request, Response } from 'express';
import { Service } from '../models/Service';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';
import { FilterQuery } from 'mongoose';

export const getServices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const query: FilterQuery<any> = {};
  if (req.query.active !== undefined) {
    query.active = req.query.active === 'true';
  }
  if (req.query.departmentId) {
    query.departmentId = req.query.departmentId;
  }
  if (req.query.search) {
    query.$or = [
      { 'name.en': { $regex: req.query.search, $options: 'i' } },
      { 'name.ar': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Service.find(query).populate('departmentId', 'name slug').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Service.countDocuments(query),
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

export const getServiceById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findById(req.params.id).populate('departmentId', 'name slug').lean();
  if (!service) {
    const error = new Error('Service not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: service });
});

export const createService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

export const updateService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    const error = new Error('Service not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    const error = new Error('Service not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'Service deleted successfully' });
});
