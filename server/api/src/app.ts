import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
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
  app.use('/api/departments', departmentRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/doctors', doctorRoutes);
  app.use('/api/health-packages', healthPackageRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/job-applications', jobApplicationRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/sarc-enquiries', sarcEnquiryRoutes);
  app.use('/api/contact-enquiries', contactEnquiryRoutes);
  app.use('/api/page-heroes', pageHeroRoutes);

  // ─── Error handling ─────────────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
