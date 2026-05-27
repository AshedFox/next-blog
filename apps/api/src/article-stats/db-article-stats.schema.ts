import z from 'zod';

export const dbArticleStatsSchema = z.object({
  articleId: z.uuid(),
  viewsCount: z.number().int(),
  updatedAt: z.coerce.date(),
});
