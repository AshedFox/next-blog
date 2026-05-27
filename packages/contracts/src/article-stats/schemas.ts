import z from 'zod';

import { datetimeOutSchema } from '../common';

export const articleStatsSchema = z.object({
  articleId: z.uuid(),
  viewsCount: z.int(),
  updatedAt: datetimeOutSchema,
});
