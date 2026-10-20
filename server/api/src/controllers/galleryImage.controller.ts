import { Request, Response } from 'express';
import { GalleryImage } from '../models/GalleryImage';

// Get all gallery images
export const getGalleryImages = async (req: Request, res: Response) => {
  try {
    const { active, departmentId, limit = 100 } = req.query;
    const query: any = {};
    if (active !== undefined) query.active = active === 'true';
    if (departmentId) {
      if (departmentId === 'null' || departmentId === 'unassigned') {
        query.departmentId = { $in: [null, undefined] };
      } else {
        query.departmentId = departmentId;
      }
    }

    const images = await GalleryImage.find(query)
      .populate('departmentId', 'name slug active')
      .sort({ order: 1, createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single gallery image
export const getGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = await GalleryImage.findById(req.params.id).populate('departmentId', 'name slug active');
    if (!image) {
      res.status(404).json({ success: false, error: 'Gallery Image not found' });
      return;
    }
    res.json({ success: true, data: image });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create new gallery image
export const createGalleryImage = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body };
    if (!payload.departmentId || payload.departmentId === '') {
      delete payload.departmentId;
    }
    const image = await GalleryImage.create(payload);
    const populated = await GalleryImage.findById(image._id).populate('departmentId', 'name slug active');
    res.status(201).json({ success: true, data: populated || image });
  } catch (error: any) {
    console.error('Error creating gallery image:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update gallery image
export const updateGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData: any = { ...req.body };
    const updateOp: any = {};

    if (updateData.departmentId === '' || updateData.departmentId === null) {
      delete updateData.departmentId;
      updateOp.$unset = { departmentId: 1 };
    }
    updateOp.$set = updateData;

    const image = await GalleryImage.findByIdAndUpdate(req.params.id, updateOp, {
      new: true,
      runValidators: true,
    }).populate('departmentId', 'name slug active');
    if (!image) {
      res.status(404).json({ success: false, error: 'Gallery Image not found' });
      return;
    }
    res.json({ success: true, data: image });
  } catch (error: any) {
    console.error('Error updating gallery image:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete gallery image
export const deleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) {
      res.status(404).json({ success: false, error: 'Gallery Image not found' });
      return;
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
