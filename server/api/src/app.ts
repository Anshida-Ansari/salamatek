import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import departmentRoutes from './routes/department.routes';
import serviceRoutes from './routes/service.routes';
import doctorRoutes from './routes/doctor.routes';
import authRoutes from './routes/auth.routes';
import healthPackageRoutes from './routes/healthPackage.routes';
import careerRoutes from './routes/career.routes';
import jobApplicationRoutes from './routes/jobApplication.routes';
import newsRoutes from './routes/news.routes';
import sarcEnquiryRoutes from './routes/sarcEnquiry.routes';
import contactEnquiryRoutes from './routes/contactEnquiry.routes';
import pageHeroRoutes from './routes/pageHeroSetting.routes';
import { errorHandler, notFound } from './middlewares/errorHandler';

export function createApp(): Application {
  const app = express();

  // ─── Rate Limiters ──────────────────────────────────────────────────────
  /** General API limiter — 100 requests per 15 minutes per IP */
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });

  /** Strict limiter for public form submissions — 10 per 15 minutes per IP */
  const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many submissions, please try again later.' },
  });

  // ─── Security ───────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ─── Logging ─────────────────────────────────────────────────────────────
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ─── Body parsing ────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Health Check ────────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Salamatek API is running' });
  });

  // ─── Routes ──────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/departments', apiLimiter, departmentRoutes);
  app.use('/api/services', apiLimiter, serviceRoutes);
  app.use('/api/doctors', apiLimiter, doctorRoutes);
  app.use('/api/health-packages', apiLimiter, healthPackageRoutes);
  app.use('/api/careers', apiLimiter, careerRoutes);
  app.use('/api/job-applications', formLimiter, jobApplicationRoutes);
  app.use('/api/news', apiLimiter, newsRoutes);
  app.use('/api/sarc-enquiries', formLimiter, sarcEnquiryRoutes);
  app.use('/api/contact-enquiries', formLimiter, contactEnquiryRoutes);
  app.use('/api/page-heroes', apiLimiter, pageHeroRoutes);

  // ─── Error handling ─────────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
