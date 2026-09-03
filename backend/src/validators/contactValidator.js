import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  projectType: z.string().optional().nullable(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
});
