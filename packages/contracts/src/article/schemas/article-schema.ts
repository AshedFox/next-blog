import z from 'zod';

import { datetimeOutSchema } from '../../common';
import { ArticleStatus } from '../enums';
import { articleBlockSchema } from './article-blocks-schemas';

export const articleSchema = z.object({
  id: z.uuid(),
  title: z.string().min(2).max(120),
  status: z.enum(ArticleStatus),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
  authorId: z.uuid(),
  blocks: z.array(articleBlockSchema).max(20),
});
