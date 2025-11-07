import z from 'zod';

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, { error: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number.' })
    .trim(),
});
