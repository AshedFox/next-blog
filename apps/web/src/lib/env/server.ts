import 'server-only';

import z from 'zod';

import type { ServerEnv } from './types';
import { serverEnvSchema } from './validation';

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cached) {
    return cached;
  }

  const parsed = serverEnvSchema.safeParse({
    ACCESS_TOKEN_COOKIE: process.env.ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE: process.env.REFRESH_TOKEN_COOKIE,
    TOKEN_REFRESH_THRESHOLD: process.env.TOKEN_REFRESH_THRESHOLD,
    NODE_ENV: process.env.NODE_ENV,
    BACKEND_INTERNAL_URL: process.env.BACKEND_INTERNAL_URL,
    STORAGE_PUBLIC_URL: process.env.STORAGE_PUBLIC_URL,
  });

  if (!parsed.success) {
    console.error(
      'Invalid server environment variables',
      JSON.stringify(z.treeifyError(parsed.error), null, 2)
    );
    throw new Error('Invalid server environment variables');
  }

  cached = parsed.data;
  return cached;
}
