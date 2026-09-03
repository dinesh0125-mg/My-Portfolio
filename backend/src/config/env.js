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
  // Email Notification Settings
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
  SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
  NOTIFICATION_RECEIVER_EMAIL: process.env.NOTIFICATION_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || 'dineshdinesh48376@gmail.com',
};
