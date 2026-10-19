import { Request, Response } from 'express';
import { ServiceCategory } from '../models/ServiceCategory';
import { Service } from '../models/Service';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';

export const getServiceCategories = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.active !== undefined) {
      filter.active = req.query.active === 'true';
    }
    if (req.query.search) {
      filter.$or = [
        { 'name.en': { $regex: req.query.search, $options: 'i' } },
        { 'name.ar': { $regex: req.query.search, $options: 'i' } },
        { slug: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      ServiceCategory.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ order: 1, createdAt: 1 })
        .lean(),
      ServiceCategory.countDocuments(filter),
    ]);

    // Attach count of services assigned to each category
    const categoryIds = data.map((c) => c._id);
    const serviceCounts = await Service.aggregate([
      { $match: { categoryId: { $in: categoryIds } } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countsMap = new Map(
      serviceCounts.map((sc) => [sc._id.toString(), sc.count])
    );

    const categoriesWithCount = data.map((cat) => ({
      ...cat,
      servicesCount: countsMap.get(cat._id.toString()) || 0,
    }));

    res.json({
      success: true,
      data: categoriesWithCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }
);

export const getServiceCategoryById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const category = await ServiceCategory.findById(req.params.id).lean();
    if (!category) {
      const error = new Error('Service category not found') as AppError;
      error.statusCode = 404;
      throw error;
    }

    const servicesCount = await Service.countDocuments({
      categoryId: category._id,
    });

    res.json({
      success: true,
      data: {
        ...category,
        servicesCount,
      },
    });
  }
);

export const createServiceCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, slug, description, order, active } = req.body;

    // Check duplicate slug
    const existingSlug = await ServiceCategory.findOne({
      slug: slug.toLowerCase().trim(),
    });
    if (existingSlug) {
      const error = new Error(
        `A category with slug "${slug}" already exists.`
      ) as AppError;
      error.statusCode = 400;
      throw error;
    }

    // Check duplicate name
    const existingName = await ServiceCategory.findOne({
      $or: [
        { 'name.en': { $regex: `^${name.en.trim()}$`, $options: 'i' } },
        { 'name.ar': { $regex: `^${name.ar.trim()}$`, $options: 'i' } },
      ],
    });
    if (existingName) {
      const error = new Error(
        `A category with this name already exists.`
      ) as AppError;
      error.statusCode = 400;
      throw error;
    }

    const category = await ServiceCategory.create({
      name,
      slug: slug.toLowerCase().trim(),
      description,
      order: order ?? 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ success: true, data: category });
  }
);

export const updateServiceCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { slug, name } = req.body;

    // Check duplicate slug if updating slug
    if (slug) {
      const existingSlug = await ServiceCategory.findOne({
        _id: { $ne: req.params.id as any },
        slug: slug.toLowerCase().trim(),
      } as any);
      if (existingSlug) {
        const error = new Error(
          `A category with slug "${slug}" already exists.`
        ) as AppError;
        error.statusCode = 400;
        throw error;
      }
    }

    // Check duplicate name if updating name
    if (name?.en || name?.ar) {
      const orConditions: any[] = [];
      if (name.en) {
        orConditions.push({
          'name.en': { $regex: `^${name.en.trim()}$`, $options: 'i' },
        });
      }
      if (name.ar) {
        orConditions.push({
          'name.ar': { $regex: `^${name.ar.trim()}$`, $options: 'i' },
        });
      }
      const existingName = await ServiceCategory.findOne({
        _id: { $ne: req.params.id as any },
        $or: orConditions,
      } as any);
      if (existingName) {
        const error = new Error(
          `A category with this name already exists.`
        ) as AppError;
        error.statusCode = 400;
        throw error;
      }
    }

    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      const error = new Error('Service category not found') as AppError;
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: category });
  }
);

export const deleteServiceCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const categoryId = req.params.id;

    // Safety check: verify no services are currently assigned
    const assignedCount = await Service.countDocuments({
      categoryId: categoryId as any,
    });
    if (assignedCount > 0) {
      const error = new Error(
        `Cannot delete category because ${assignedCount} service(s) are currently assigned to it. Please reassign or delete those services first.`
      ) as AppError;
      error.statusCode = 400;
      throw error;
    }

    const category = await ServiceCategory.findByIdAndDelete(categoryId);
    if (!category) {
      const error = new Error('Service category not found') as AppError;
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      message: 'Service category deleted successfully',
    });
  }
);
