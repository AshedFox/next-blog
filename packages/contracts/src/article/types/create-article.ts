import z from 'zod';

import { createArticleSchema } from '../schemas/create-article-schema';

export type CreateArticleDto = z.infer<typeof createArticleSchema>;
