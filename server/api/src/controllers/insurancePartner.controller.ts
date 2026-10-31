import { Request, Response } from 'express';
import { InsurancePartner } from '../models/InsurancePartner';

export const INITIAL_INSURANCE_PARTNERS = [
  { name: 'BUPA', image: 'bupa.png', order: 1 },
  { name: 'TAWUNIYA', image: 'tawuniya.jpg', order: 2 },
  { name: 'MEDGULF', image: 'medgulf.jpg', order: 3 },
  { name: 'GULF UNION', image: 'gulfunion.png', order: 4 },
  { name: 'GIG', image: 'gig.png', order: 5 },
  { name: 'MALATH', image: 'malath.png', order: 6 },
  { name: 'AL RAJHI TAKAFUL', image: 'al-rajhi.png', order: 7 },
  { name: 'SAICO', image: 'saico.png', order: 8 },
  { name: 'WALA', image: 'wala.jpg', order: 9 },
  { name: 'ARABIA', image: 'arabia.jpg', order: 10 },
  { name: 'ALLIED', image: 'allied.jpg', order: 11 },
  { name: 'AL JAZEERA', image: 'al-jazeera.png', order: 12 },
  { name: 'AL ETIHAD', image: 'al-etihad.png', order: 13 },
  { name: 'ARABIAN SHIELD', image: 'arabian-shield.jpg', order: 14 },
  { name: 'AL SAGAR', image: 'al-sagar.jpg', order: 15 },
  { name: 'BURUJ', image: 'burj.png', order: 16 },
  { name: 'CIGNA', image: 'cigna.png', order: 17 },
  { name: 'MUTAKAMELA', image: 'mutakamela.png', order: 18 },
  { name: 'AMANA', image: 'amana.png', order: 19 },
  { name: 'ORIENT', image: 'orient.png', order: 20 },
  { name: 'SALAMA', image: 'salama.png', order: 21 },
  { name: 'SAUDI ENAYA', image: 'saudi-enaya.png', order: 22 },
  { name: 'GULF GENERAL', image: 'gulf-general.png', order: 23 },
  { name: 'TCS (TOTAL CARE SAUDI)', image: 'tcs.png', order: 24 },
  { name: 'SNC (SAUDI NEXTCARE)', image: 'nextcare.png', order: 25 },
  { name: 'GLOBEMED', image: 'globemed.jpg', order: 26 },
  { name: 'UNITED COOPERATIVE ASSURANCE', image: 'united-cooperative.png', order: 27 },
  { name: 'LIVA', image: 'liva.png', order: 28 },
  { name: 'TAMAYAH', image: 'tamayah.png', order: 29 },
];

/** Ensure base insurance partners exist in the database */
async function ensureInitialPartners() {
  const count = await InsurancePartner.countDocuments();
  if (count === 0) {
    const docs = INITIAL_INSURANCE_PARTNERS.map((p) => ({
      ...p,
      active: true,
      isCustom: false,
    }));
    await InsurancePartner.insertMany(docs);
  }
}

// Get all insurance partners
export const getInsurancePartners = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureInitialPartners();

    const { active, limit = 500 } = req.query;
    const query: any = {};
    if (active !== undefined) query.active = active === 'true';

    const partners = await InsurancePartner.find(query)
      .sort({ order: 1, createdAt: 1 })
      .limit(Number(limit));

    res.json({ success: true, count: partners.length, data: partners });
  } catch (error) {
    console.error('Error fetching insurance partners:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single insurance partner
export const getInsurancePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = await InsurancePartner.findById(req.params.id);
    if (!partner) {
      res.status(404).json({ success: false, error: 'Insurance Partner not found' });
      return;
    }
    res.json({ success: true, data: partner });
  } catch (error) {
    console.error('Error fetching insurance partner:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create new insurance partner (Additive)
export const createInsurancePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, active, order } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Partner name is required' });
      return;
    }
    if (!image || !image.trim()) {
      res.status(400).json({ success: false, error: 'Partner logo image is required' });
      return;
    }

    let calculatedOrder = order !== undefined ? Number(order) : undefined;
    if (calculatedOrder === undefined || isNaN(calculatedOrder)) {
      const highestOrder = await InsurancePartner.findOne().sort({ order: -1 }).select('order');
      calculatedOrder = highestOrder && highestOrder.order ? highestOrder.order + 1 : 1;
    }

    const partner = await InsurancePartner.create({
      name: name.trim(),
      image: image.trim(),
      order: calculatedOrder,
      active: active !== undefined ? Boolean(active) : true,
      isCustom: true,
    });

    res.status(201).json({ success: true, data: partner });
  } catch (error) {
    console.error('Error creating insurance partner:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update insurance partner
export const updateInsurancePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, active, order } = req.body;
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (image !== undefined) updateData.image = image.trim();
    if (active !== undefined) updateData.active = Boolean(active);
    if (order !== undefined) updateData.order = Number(order);

    const partner = await InsurancePartner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!partner) {
      res.status(404).json({ success: false, error: 'Insurance Partner not found' });
      return;
    }

    res.json({ success: true, data: partner });
  } catch (error) {
    console.error('Error updating insurance partner:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete insurance partner
export const deleteInsurancePartner = async (req: Request, res: Response): Promise<void> => {
  try {
    const partner = await InsurancePartner.findByIdAndDelete(req.params.id);
    if (!partner) {
      res.status(404).json({ success: false, error: 'Insurance Partner not found' });
      return;
    }
    res.json({ success: true, message: 'Insurance Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting insurance partner:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
