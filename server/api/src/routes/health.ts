import { Router, type Request, type Response } from 'express';
import type { HealthCheckResponse } from '@salamatek/types';

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Returns the current health status of the API.
 */
healthRouter.get('/', (_req: Request, res: Response<HealthCheckResponse>) => {
  const response: HealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '0.0.1',
    environment: process.env['NODE_ENV'] ?? 'development',
  };
  res.status(200).json(response);
});
