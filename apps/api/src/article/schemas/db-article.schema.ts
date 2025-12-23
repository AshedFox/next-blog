import z from 'zod';

import { ArticleStatus } from '@/prisma/generated/enums';
import { dbBaseUserSchema } from '@/user/schemas/db-user.schema';

export const dbBaseArticleSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  blocks: z.json(),
  status: z.enum(ArticleStatus),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  authorId: z.uuid(),
});

export const dbArticleSchema = dbBaseArticleSchema.extend({
  author: z.lazy(() => dbBaseUserSchema).optional(),
});
