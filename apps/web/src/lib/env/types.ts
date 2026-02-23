import z from 'zod';

import { serverEnvSchema } from './validation';

export type ServerEnv = z.infer<typeof serverEnvSchema>;
