import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from './asyncHandler';
import { Admin } from '../models/Admin';
import { AppError } from './errorHandler';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      const admin = await Admin.findById(decoded.id).select('-passwordHash');
      
      if (!admin) {
        throw new Error('Not authorized, admin not found');
      }

      // @ts-ignore
      req.admin = admin;

      next();
    } catch (error) {
      console.error(error);
      const err = new Error('Not authorized, token failed') as AppError;
      err.statusCode = 401;
      throw err;
    }
  }

  if (!token) {
    const err = new Error('Not authorized, no token') as AppError;
    err.statusCode = 401;
    throw err;
  }
});

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!roles.includes(req.admin.role)) {
      const err = new Error(`Role ${/* @ts-ignore */ req.admin.role} is not authorized to access this route`) as AppError;
      err.statusCode = 403;
      throw err;
    }
    next();
  };
};
