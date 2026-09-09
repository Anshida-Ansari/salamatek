import 'dotenv/config';
import { connectDB } from './config/database';
import { createApp } from './app';

const startServer = async () => {
  await connectDB();
  const app = createApp();

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Salamatek API`);
    console.log(`   Environment : ${process.env.NODE_ENV}`);
    console.log(`   Port        : ${PORT}`);
    console.log(`   Health      : http://localhost:${PORT}/api/health\n`);
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
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
