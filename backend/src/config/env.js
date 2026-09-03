import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_replace_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ADMIN_NAME: process.env.ADMIN_NAME || 'Dinesh M',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'nandhu0259@gmail.com',
};
