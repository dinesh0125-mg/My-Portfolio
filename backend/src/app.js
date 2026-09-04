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

import {
  notFoundHandler,
  errorHandler,
} from './middleware/errorMiddleware.js';

const app = express();

/*
 * =========================================================
 * RENDER / REVERSE PROXY CONFIGURATION
 * =========================================================
 *
 * Render sits behind a reverse proxy and forwards the
 * original client IP using X-Forwarded-For.
 *
 * express-rate-limit requires Express to trust the proxy
 * so it can correctly identify the real client IP.
 */
app.set('trust proxy', 1);

/*
 * =========================================================
 * SECURITY
 * =========================================================
 */

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/*
 * =========================================================
 * CORS
 * =========================================================
 */

const allowedOrigins = [
  ENV.CLIENT_URL,
  'https://dinesh25.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Allow requests without Origin header.
       *
       * Useful for:
       * - Postman
       * - Thunder Client
       * - curl
       * - server-to-server requests
       */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `[CORS] Blocked origin: ${origin}`
      );

      return callback(
        new Error(
          `CORS origin not allowed: ${origin}`
        )
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],

    exposedHeaders: [
      'Content-Length',
    ],
  })
);

/*
 * =========================================================
 * PERFORMANCE
 * =========================================================
 */

app.use(compression());

/*
 * =========================================================
 * REQUEST BODY PARSING
 * =========================================================
 */

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

/*
 * =========================================================
 * REQUEST LOGGING
 * =========================================================
 *
 * Log requests in development.
 *
 * In production Render already provides request logs,
 * so we don't need duplicate logging here.
 */

if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/*
 * =========================================================
 * HEALTH CHECK
 * =========================================================
 */

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/*
 * =========================================================
 * PRIMARY VERSIONED API ROUTES
 * =========================================================
 *
 * /api/v1/...
 */

/*
 * Admin Authentication
 *
 * POST /api/v1/admin/auth/login
 * GET  /api/v1/admin/auth/profile
 */
app.use(
  '/api/v1/admin/auth',
  authRoutes
);

/*
 * Admin Upload
 *
 * POST /api/v1/admin/upload/...
 */
app.use(
  '/api/v1/admin/upload',
  uploadRoutes
);

/*
 * Admin CMS Routes
 *
 * /api/v1/admin/...
 */
app.use(
  '/api/v1/admin',
  adminRoutes
);

/*
 * Public Routes
 *
 * /api/v1/...
 */
app.use(
  '/api/v1',
  publicRoutes
);

/*
 * =========================================================
 * COMPATIBILITY ALIASES
 * =========================================================
 *
 * Existing frontend/API clients using /api/...
 * will continue to work.
 */

/*
 * Admin Authentication
 *
 * /api/admin/auth/...
 */
app.use(
  '/api/admin/auth',
  authRoutes
);

/*
 * Admin Upload
 *
 * /api/admin/upload/...
 */
app.use(
  '/api/admin/upload',
  uploadRoutes
);

/*
 * Admin CMS
 *
 * /api/admin/...
 */
app.use(
  '/api/admin',
  adminRoutes
);

/*
 * Public API
 *
 * /api/...
 */
app.use(
  '/api',
  publicRoutes
);

/*
 * =========================================================
 * 404 HANDLER
 * =========================================================
 */

app.use(notFoundHandler);

/*
 * =========================================================
 * CENTRAL ERROR HANDLER
 * =========================================================
 */

app.use(errorHandler);

export default app;
