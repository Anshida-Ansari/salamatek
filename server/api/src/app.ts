import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { router } from './routes';

export function createApp(): Application {
  const app = express();

  // ─── Security ───────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.ALLOWED_ORIGINS,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ─── Logging ─────────────────────────────────────────────────────────────
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ─── Body parsing ────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Routes ──────────────────────────────────────────────────────────────
  app.use('/api/v1', router);

  // ─── 404 handler ─────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: { message: 'Route not found', code: 'NOT_FOUND' },
    });
  });

  // ─── Global error handler ─────────────────────────────────────────────────
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: {
          message:
            env.NODE_ENV === 'production'
              ? 'Internal server error'
              : err.message,
          code: 'INTERNAL_SERVER_ERROR',
        },
      });
    }
  );

  return app;
}
