import z from 'zod';

import { articleSearchResponseSchema } from '../schemas/article-search-response-schema';

export type ArticleSearchResponseDto = z.infer<
  typeof articleSearchResponseSchema
>;
