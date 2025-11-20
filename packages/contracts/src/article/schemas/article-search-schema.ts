import z from 'zod';

import { paginationSchema } from '../../common';
import { articleFiltersSchema } from './article-filters-schema';
import { articleIncludeSchema } from './article-include-schema';
import { articleSortSchema } from './article-sort-schema';

export const articleSearchSchema = z.object({
  ...paginationSchema.shape,
  ...articleFiltersSchema.shape,
  sort: articleSortSchema.optional(),
  include: articleIncludeSchema.optional(),
  search: z.string().min(2).max(100).optional(),
});
