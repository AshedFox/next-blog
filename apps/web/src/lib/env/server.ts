import 'server-only';

import z from 'zod';

import { serverEnvSchema } from './validation';

const parsed = serverEnvSchema.safeParse({
  ACCESS_TOKEN_COOKIE: process.env.ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE: process.env.REFRESH_TOKEN_COOKIE,
  TOKEN_REFRESH_THRESHOLD: process.env.TOKEN_REFRESH_THRESHOLD,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error(
    'Invalid server environment variables',
    z.treeifyError(parsed.error).errors
  );
  throw new Error('Invalid server environment variables');
}

export const serverEnv = parsed.data;
