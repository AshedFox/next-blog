import z from 'zod';

export const serverEnvSchema = z.object({
  ACCESS_TOKEN_COOKIE: z.string().min(1).default('access_token'),
  REFRESH_TOKEN_COOKIE: z.string().min(1).default('refresh_token'),
  TOKEN_REFRESH_THRESHOLD: z
    .number()
    .min(1)
    .default(2 * 60 * 1000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.url(),
});
