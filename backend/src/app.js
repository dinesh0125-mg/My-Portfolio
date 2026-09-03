import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { ENV } from './config/env.js';

import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS configuration
const allowedOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin not allowed: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Performance compression & request parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Primary Versioned API Routes (/api/v1/...)
app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/admin/upload', uploadRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', publicRoutes);

// Compatibility aliases for /api/...
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

export default app;
