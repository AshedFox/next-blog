import z from 'zod';

import { dbBaseCommentSchema } from '@/comment/schemas/db-comment.schema';
import { ArticleStatus } from '@/prisma/generated/enums';
import { dbBaseTagSchema } from '@/tag/schemas/db-tag.schema';
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
  comments: z.lazy(() => z.array(dbBaseCommentSchema)).optional(),
  tags: z.lazy(() => z.array(dbBaseTagSchema)).optional(),
});
