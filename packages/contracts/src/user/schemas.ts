import z from 'zod';

import { datetimeOutSchema } from '../common';
import { UserRole, UserStatus } from './enums';

export const createUserSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, {
      error: 'Password must contain at least one letter.',
    })
    .regex(/[0-9]/, { error: 'Password must contain at least one number.' })
    .trim(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
});

export const userSchema = z.object({
  id: z.uuid(),
  email: z.email().trim(),
  username: z.string().min(2).max(60),
  name: z.string().min(2).max(120),
  role: z.enum(UserRole),
  status: z.enum(UserStatus),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
});
