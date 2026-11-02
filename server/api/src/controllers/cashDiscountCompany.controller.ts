import { Request, Response } from 'express';
import { CashDiscountCompany } from '../models/CashDiscountCompany';

// Get all cash discount companies
export const getCashDiscountCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { active, limit = 500 } = req.query;
    const query: any = {};
    if (active !== undefined) query.active = active === 'true';

    const companies = await CashDiscountCompany.find(query)
      .sort({ order: 1, createdAt: 1 })
      .limit(Number(limit));

    res.json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    console.error('Error fetching cash discount companies:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single cash discount company
export const getCashDiscountCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await CashDiscountCompany.findById(req.params.id);
    if (!company) {
      res.status(404).json({ success: false, error: 'Cash Discount Company not found' });
      return;
    }
    res.json({ success: true, data: company });
  } catch (error) {
    console.error('Error fetching cash discount company:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create new cash discount company
export const createCashDiscountCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, active, order } = req.body;

    if (!image || !image.trim()) {
      res.status(400).json({ success: false, error: 'Logo image is required' });
      return;
    }

    let calculatedOrder = order !== undefined && order !== '' ? Number(order) : undefined;
    if (calculatedOrder === undefined || isNaN(calculatedOrder)) {
      const highestOrder = await CashDiscountCompany.findOne().sort({ order: -1 }).select('order');
      calculatedOrder = highestOrder && highestOrder.order ? highestOrder.order + 1 : 1;
    }

    const company = await CashDiscountCompany.create({
      name: (name || '').trim(),
      image: image.trim(),
      order: calculatedOrder,
      active: active !== undefined ? Boolean(active) : true,
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    console.error('Error creating cash discount company:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update cash discount company
export const updateCashDiscountCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, active, order } = req.body;
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (image !== undefined) updateData.image = image.trim();
    if (active !== undefined) updateData.active = Boolean(active);
    if (order !== undefined && order !== '') updateData.order = Number(order);

    const company = await CashDiscountCompany.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      res.status(404).json({ success: false, error: 'Cash Discount Company not found' });
      return;
    }

    res.json({ success: true, data: company });
  } catch (error) {
    console.error('Error updating cash discount company:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete cash discount company
export const deleteCashDiscountCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const company = await CashDiscountCompany.findByIdAndDelete(req.params.id);
    if (!company) {
      res.status(404).json({ success: false, error: 'Cash Discount Company not found' });
      return;
    }
    res.json({ success: true, message: 'Cash Discount Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting cash discount company:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
