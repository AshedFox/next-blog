import z from 'zod';

import { createArrayFilterSchema, datetimeInSchema } from '../../common';
import { ArticleStatus } from '../enums';

export const articleFiltersSchema = z
  .object({
    title: z.string().min(2).max(120),
    status: createArrayFilterSchema(z.array(z.enum(ArticleStatus))),
    authorId: createArrayFilterSchema(z.array(z.uuid())),
    createdAtGte: datetimeInSchema,
    createdAtLte: datetimeInSchema,
  })
  .partial();
