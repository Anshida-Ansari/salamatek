import { Request, Response } from 'express';
import { JobApplication } from '../models/JobApplication';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getJobApplications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.careerId) {
    filter.careerId = req.query.careerId;
  }
  if (req.query.search) {
    filter.$or = [
      { fullName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    JobApplication.find(filter).populate('careerId', 'title slug').skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    JobApplication.countDocuments(filter),
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

export const getJobApplicationById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const app = await JobApplication.findById(req.params.id).populate('careerId', 'title slug').lean();
  if (!app) {
    const error = new Error('Job application not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: app });
});

export const createJobApplication = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const app = await JobApplication.create(req.body);
  res.status(201).json({ success: true, data: app });
});

export const updateJobApplicationStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const app = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!app) {
    const error = new Error('Job application not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: app });
});

export const deleteJobApplication = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const app = await JobApplication.findByIdAndDelete(req.params.id);
  if (!app) {
    const error = new Error('Job application not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'Job application deleted successfully' });
});
