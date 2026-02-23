import z from 'zod';

export const serverEnvSchema = z.object({
  ACCESS_TOKEN_COOKIE: z.string().min(1).default('access_token'),
  REFRESH_TOKEN_COOKIE: z.string().min(1).default('refresh_token'),
  TOKEN_REFRESH_THRESHOLD: z.coerce
    .number()
    .min(1)
    .default(2 * 60 * 1000),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  BACKEND_INTERNAL_URL: z.url(),
  STORAGE_PUBLIC_URL: z.url(),
});
