import bcrypt from 'bcryptjs';

export async function hashPassword(plainText, saltRounds = 10) {
  return bcrypt.hash(plainText, saltRounds);
}

export async function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}
