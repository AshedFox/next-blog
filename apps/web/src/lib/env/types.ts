import z from 'zod';

import { clientEnvSchema } from './validation';

export type ClientEnv = z.infer<typeof clientEnvSchema>;
