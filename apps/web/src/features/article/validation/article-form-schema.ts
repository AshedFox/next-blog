import { createArticleSchema, MAX_BLOCKS } from '@workspace/contracts';
import z from 'zod';

import { articleBlockFormSchema } from './article-block-form-schemas';

export const articleFormSchema = createArticleSchema.extend({
  blocks: z.array(articleBlockFormSchema).min(1).max(MAX_BLOCKS),
});
