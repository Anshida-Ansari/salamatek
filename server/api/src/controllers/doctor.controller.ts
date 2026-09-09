import { Request, Response } from 'express';
import { Doctor } from '../models/Doctor';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getDoctors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.active !== undefined) {
    filter.active = req.query.active === 'true';
  }
  if (req.query.departmentId) {
    filter.departmentId = req.query.departmentId;
  }
  if (req.query.search) {
    filter.$or = [
      { 'name.en': { $regex: req.query.search, $options: 'i' } },
      { 'name.ar': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Doctor.find(filter).populate('departmentId', 'name slug').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Doctor.countDocuments(filter),
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

export const getDoctorById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const doctor = await Doctor.findById(req.params.id).populate('departmentId', 'name slug').lean();
  if (!doctor) {
    const error = new Error('Doctor not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: doctor });
});

export const createDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ success: true, data: doctor });
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doctor) {
    const error = new Error('Doctor not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: doctor });
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) {
    const error = new Error('Doctor not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'Doctor deleted successfully' });
});
