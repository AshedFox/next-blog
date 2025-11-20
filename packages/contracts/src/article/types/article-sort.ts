import z from 'zod';

import { articleSortSchema } from '../schemas';

export type ArticleSort = z.infer<typeof articleSortSchema>;
