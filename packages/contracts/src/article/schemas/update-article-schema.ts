import { createArticleSchema } from './create-article-schema';

export const updateArticleSchema = createArticleSchema.partial({
  blocks: true,
  title: true,
});
