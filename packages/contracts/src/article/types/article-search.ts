import z from 'zod';

import { articleSearchSchema } from '../schemas';

export type ArticleSearch = z.infer<typeof articleSearchSchema>;
