import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma');
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error.message);
    process.exit(1);
  }
}
