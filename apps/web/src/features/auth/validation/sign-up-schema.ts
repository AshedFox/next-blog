import z from 'zod';

import { loginSchema } from './login-schema';

export const signUpSchema = loginSchema
  .extend({
    passwordComparison: z.string(),
  })
  .refine((data) => data.password === data.passwordComparison, {
    message: 'Passwords do not match',
    path: ['passwordComparison'],
  });
