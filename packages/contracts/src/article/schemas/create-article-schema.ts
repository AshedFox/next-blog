import z from 'zod';

import { MAX_BLOCKS } from '../constants';
import { createArticleBlockSchema } from './create-article-blocks-schemas';

export const createArticleSchema = z.object({
  title: z.string().min(2).max(120),
  blocks: z.array(createArticleBlockSchema).min(1).max(MAX_BLOCKS),
});
