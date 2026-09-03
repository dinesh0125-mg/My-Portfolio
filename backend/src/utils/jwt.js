import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export function signToken(payload, expiresIn = ENV.JWT_EXPIRES_IN) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, ENV.JWT_SECRET);
}
