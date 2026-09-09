import { Request, Response } from 'express';
import { SarcEnquiry } from '../models/SarcEnquiry';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getSarcEnquiries = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.search) {
    filter.$or = [
      { companyName: { $regex: req.query.search, $options: 'i' } },
      { contactPerson: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    SarcEnquiry.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
    SarcEnquiry.countDocuments(filter),
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

export const getSarcEnquiryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const enquiry = await SarcEnquiry.findById(req.params.id).lean();
  if (!enquiry) {
    const error = new Error('SARC Enquiry not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: enquiry });
});

export const createSarcEnquiry = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const enquiry = await SarcEnquiry.create(req.body);
  res.status(201).json({ success: true, data: enquiry });
});

export const updateSarcEnquiryStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const enquiry = await SarcEnquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!enquiry) {
    const error = new Error('SARC Enquiry not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: enquiry });
});

export const deleteSarcEnquiry = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const enquiry = await SarcEnquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) {
    const error = new Error('SARC Enquiry not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'SARC Enquiry deleted successfully' });
});
