import { Request, Response } from 'express';
import { OpticalBrand } from '../models/OpticalBrand';

export const INITIAL_OPTICAL_BRANDS = [
  { name: 'Puma', image: 'PUMA.png', order: 1 },
  { name: 'Ray ban', image: 'rayban.png', order: 2 },
  { name: 'Police', image: 'police.png', order: 3 },
  { name: 'Nike', image: 'nike.png', order: 4 },
  { name: 'Fila', image: 'fila.png', order: 5 },
  { name: 'Calvin klein', image: 'calvin-klein.png', order: 6 },
  { name: 'Gucci', image: 'gucci.png', order: 7 },
  { name: 'Vogue', image: 'Vogue.png', order: 8 },
  { name: 'Tiffany & co', image: 'tiffany.jpg', order: 9 },
  { name: 'Burberry', image: 'Burberry.png', order: 10 },
  { name: 'Prada', image: 'prada.png', order: 11 },
  { name: 'Emperio armani', image: 'emprorio.png', order: 12 },
  { name: 'Armani exchange', image: 'armani.png', order: 13 },
  { name: 'Saint Lauren', image: 'saint-laurent.png', order: 14 },
  { name: 'Lacoste', image: 'Lacoste.jpg', order: 15 },
  { name: 'Dunhill', image: 'Dunhill.png', order: 16 },
  { name: 'Maui Jim', image: 'mauijim.png', order: 17 },
  { name: 'Oakley', image: 'Oakley.png', order: 18 },
  { name: 'Tommy hilfiger', image: 'Tommy-hilfiger.jpg', order: 19 },
  { name: 'Polo', image: 'polo.png', order: 20 },
  { name: 'Hugo boss', image: 'Hugo-Boss.png', order: 21 },
  { name: 'Dolce & Gabbana', image: 'dolce-gabbana.jpg', order: 22 },
  { name: 'Bvlgari', image: 'Bvlgari.webp', order: 23 },
  { name: 'Michael kors', image: 'michael-kors.png', order: 24 },
  { name: 'Versace', image: 'Versace.jpg', order: 25 },
  { name: 'Chopard', image: 'Chopard.png', order: 26 },
  { name: 'Swarovski', image: 'Swarovski.jpg', order: 27 },
  { name: 'Dkny', image: 'dkny.png', order: 28 },
];

/** Ensure base brands exist in the database */
async function ensureInitialBrands() {
  const count = await OpticalBrand.countDocuments();
  if (count === 0) {
    const docs = INITIAL_OPTICAL_BRANDS.map((b) => ({
      ...b,
      active: true,
      isCustom: false,
    }));
    await OpticalBrand.insertMany(docs);
  }
}

// Get all optical brands
export const getOpticalBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureInitialBrands();

    const { active, limit = 500 } = req.query;
    const query: any = {};
    if (active !== undefined) query.active = active === 'true';

    const brands = await OpticalBrand.find(query)
      .sort({ order: 1, createdAt: 1 })
      .limit(Number(limit));

    res.json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    console.error('Error fetching optical brands:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get single optical brand
export const getOpticalBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brand = await OpticalBrand.findById(req.params.id);
    if (!brand) {
      res.status(404).json({ success: false, error: 'Optical Brand not found' });
      return;
    }
    res.json({ success: true, data: brand });
  } catch (error) {
    console.error('Error fetching optical brand:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create new optical brand (Additive)
export const createOpticalBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, active, order } = req.body;

    if (!image || !image.trim()) {
      res.status(400).json({ success: false, error: 'Logo image is required' });
      return;
    }

    let calculatedOrder = order !== undefined ? Number(order) : undefined;
    if (calculatedOrder === undefined || isNaN(calculatedOrder)) {
      const highestOrder = await OpticalBrand.findOne().sort({ order: -1 }).select('order');
      calculatedOrder = highestOrder && highestOrder.order ? highestOrder.order + 1 : 1;
    }

    const brand = await OpticalBrand.create({
      name: (name || '').trim(),
      image: image.trim(),
      order: calculatedOrder,
      active: active !== undefined ? Boolean(active) : true,
      isCustom: true,
    });

    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    console.error('Error creating optical brand:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update optical brand
export const updateOpticalBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, image, active, order } = req.body;
    const updateData: any = {};

    if (name !== undefined) updateData.name = name.trim();
    if (image !== undefined) updateData.image = image.trim();
    if (active !== undefined) updateData.active = Boolean(active);
    if (order !== undefined) updateData.order = Number(order);

    const brand = await OpticalBrand.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      res.status(404).json({ success: false, error: 'Optical Brand not found' });
      return;
    }

    res.json({ success: true, data: brand });
  } catch (error) {
    console.error('Error updating optical brand:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Delete optical brand
export const deleteOpticalBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brand = await OpticalBrand.findByIdAndDelete(req.params.id);
    if (!brand) {
      res.status(404).json({ success: false, error: 'Optical Brand not found' });
      return;
    }
    res.json({ success: true, message: 'Optical Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting optical brand:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

