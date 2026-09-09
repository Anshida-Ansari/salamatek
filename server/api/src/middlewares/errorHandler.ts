import type { Request, Response, NextFunction } from 'express';

// Define a custom error type if needed
export interface AppError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? err.statusCode || 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  res.status(404);
  next(error);
};
