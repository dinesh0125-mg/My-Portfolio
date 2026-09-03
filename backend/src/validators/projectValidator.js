import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  category: z.string().min(2, 'Category is required'),
  shortDescription: z.string().min(5, 'Short description is required'),
  description: z.string().min(10, 'Full description is required'),
  problemSolved: z.string().optional().nullable(),
  myContribution: z.string().optional().nullable(),
  developmentApproach: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imagePublicId: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  liveDemoUrl: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
  displayOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  technologies: z.array(z.string()).optional().default([]),
});
