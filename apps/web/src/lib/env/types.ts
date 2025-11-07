import z from 'zod';

import { clientEnvSchema, serverEnvSchema } from './validation';

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
