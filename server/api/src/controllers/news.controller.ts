import { Request, Response } from 'express';
import { News } from '../models/News';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getNews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (req.query.status) {
    filter.status = req.query.status;
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
    News.find(filter).skip(skip).limit(limit).sort({ publishedDate: -1 }).lean(),
    News.countDocuments(filter),
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

export const getNewsById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const news = await News.findById(req.params.id).lean();
  if (!news) {
    const error = new Error('News not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: news });
});

export const getNewsBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const news = await News.findOne({ slug: req.params.slug }).lean();
  if (!news) {
    const error = new Error('News not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: news });
});

export const createNews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const news = await News.create(req.body);
  res.status(201).json({ success: true, data: news });
});

export const updateNews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const news = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!news) {
    const error = new Error('News not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: news });
});

export const deleteNews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const news = await News.findByIdAndDelete(req.params.id);
  if (!news) {
    const error = new Error('News not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, message: 'News deleted successfully' });
});
