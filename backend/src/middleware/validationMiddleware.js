import { sendError } from '../utils/response.js';

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return sendError(res, 'Validation failed. Please check your inputs.', errorMessages, 400);
    }
    req.validatedBody = result.data;
    next();
  };
}
