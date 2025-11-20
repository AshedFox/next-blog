import z from 'zod';

import { articleFiltersSchema } from '../schemas';

export type ArticleFilters = z.infer<typeof articleFiltersSchema>;
