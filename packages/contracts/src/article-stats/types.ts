import z from 'zod';

import { articleStatsSchema } from './schemas';

export type ArticleStatsDto = z.infer<typeof articleStatsSchema>;
