import z from 'zod';

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.url(),
});
