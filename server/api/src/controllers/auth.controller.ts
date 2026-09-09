import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../middlewares/errorHandler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    if (!admin.active) {
      const error = new Error('Admin account is deactivated') as AppError;
      error.statusCode = 403;
      throw error;
    }

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id.toString()),
      },
    });
  } else {
    const error = new Error('Invalid email or password') as AppError;
    error.statusCode = 401;
    throw error;
  }
});

export const getMe = asyncHandler(async (req: any, res: Response) => {
  const admin = await Admin.findById(req.admin._id).select('-passwordHash');
  if (!admin) {
    const error = new Error('Admin not found') as AppError;
    error.statusCode = 404;
    throw error;
  }
  res.json({ success: true, data: admin });
});

// Temporary endpoint for development to create the first admin
export const createInitialAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const adminExists = await Admin.findOne({ email: 'admin@salamatek.com' });
  if (adminExists) {
    res.json({ message: 'Admin already exists' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  const admin = await Admin.create({
    name: 'Super Admin',
    email: 'admin@salamatek.com',
    passwordHash,
    role: 'super_admin',
  });

  res.status(201).json({ success: true, data: admin });
});
