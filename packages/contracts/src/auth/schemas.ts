import z from 'zod';

import { datetimeOutSchema } from '../common';
import { baseUserSchema } from '../user';

export const loginSchema = z.object({
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

export const signUpSchema = loginSchema
  .extend({
    passwordComparison: z.string(),
  })
  .refine((data) => data.password === data.passwordComparison, {
    message: 'Passwords do not match',
    path: ['passwordComparison'],
  });

export const authResponseSchema = z.object({
  accessToken: z.string(),
  accessTokenExpiresAt: datetimeOutSchema,
  tokenType: z.literal('Bearer'),
  refreshToken: z.string(),
  refreshTokenExpiresAt: datetimeOutSchema,
  user: baseUserSchema,
});
