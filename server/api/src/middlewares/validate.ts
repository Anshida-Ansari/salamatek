import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const err = new Error('Validation failed') as AppError;
        err.statusCode = 422;
        // Format Zod errors to a simpler key-value map
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((e) => {
          // e.path[0] is typically 'body', 'query', or 'params', e.path[1] is the field
          const field = e.path.slice(1).join('.');
          formattedErrors[field] = e.message;
        });
        err.errors = formattedErrors;
        return next(err);
      }
      next(error);
    }
  };
