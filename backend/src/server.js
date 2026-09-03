import app from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase, prisma } from './config/database.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(ENV.PORT, () => {
    logger.success(`🚀 Portfolio REST API server running on port ${ENV.PORT}`);
    logger.info(`📡 Health check available at: http://localhost:${ENV.PORT}/api/v1/health`);
    logger.info(`🌍 Public portfolio API: http://localhost:${ENV.PORT}/api/v1/portfolio`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Database disconnected. Server stopped.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to bootstrap server:', err);
  process.exit(1);
});
