import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  return sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, [], 404);
}

export function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File too large. Maximum allowed size exceeded.', [err.message], 400);
    }
    return sendError(res, `Upload error: ${err.message}`, [err.message], 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'An unexpected server error occurred.';

  return sendError(
    res,
    message,
    process.env.NODE_ENV === 'development' ? [err.message] : [],
    statusCode
  );
}
