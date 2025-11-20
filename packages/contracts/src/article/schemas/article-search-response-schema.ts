import { createPaginatedResponseSchema } from '../../common';
import { articleSchema } from './article-schema';

export const articleSearchResponseSchema =
  createPaginatedResponseSchema(articleSchema);
