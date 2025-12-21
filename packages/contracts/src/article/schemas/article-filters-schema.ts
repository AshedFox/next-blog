import z from 'zod';

import { createArrayFilterSchema, datetimeInSchema } from '../../common';
import { ArticleStatus } from '../enums';

export const articleFiltersSchema = z.object({
  title: z.string().min(2).max(120).optional().catch(undefined),
  status: createArrayFilterSchema(z.array(z.enum(ArticleStatus)))
    .optional()
    .catch(undefined),
  authorId: createArrayFilterSchema(z.array(z.uuid()))
    .optional()
    .catch(undefined),
  createdAtGte: datetimeInSchema.optional().catch(undefined),
  createdAtLte: datetimeInSchema.optional().catch(undefined),
});
