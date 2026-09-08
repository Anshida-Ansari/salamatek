import 'dotenv/config';
import { env } from './config/env';
import { createApp } from './app';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`\n🚀 Salamatek API`);
  console.log(`   Environment : ${env.NODE_ENV}`);
  console.log(`   Port        : ${env.PORT}`);
  console.log(`   Health      : http://localhost:${env.PORT}/api/v1/health\n`);
});

// Graceful shutdown
const shutdown = (signal: string): void => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => { shutdown('SIGTERM'); });
process.on('SIGINT', () => { shutdown('SIGINT'); });
