import { clientEnvSchema } from './validation';

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

if (!parsed.success) {
  throw new Error('Invalid client environment variables');
}

export const clientEnv = parsed.data;
