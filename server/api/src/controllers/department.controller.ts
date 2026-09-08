import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';
import { FilterQuery } from 'mongoose';

export const getDepartments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const query: FilterQuery<any> = {};
  if (req.query.active !== undefined) {
    query.active = req.query.active === 'true';
  }
  if (req.query.search) {
    query.$or = [
      { 'name.en': { $regex: req.query.search, $options: 'i' } },
      { 'name.ar': { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    Department.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    Department.countDocuments(query),
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

export const getDepartmentById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const department = await Department.findById(req.params.id).lean();
  if (!department) {
    const error = new Error('Department not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: department });
});

export const createDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const department = await Department.create(req.body);
  res.status(201).json({ success: true, data: department });
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!department) {
    const error = new Error('Department not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: department });
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) {
    const error = new Error('Department not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'Department deleted successfully' });
});
