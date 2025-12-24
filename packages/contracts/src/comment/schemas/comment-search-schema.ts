import z from 'zod';

import { cursorPaginationSchema } from '../../common';
import { commentIncludeSchema } from './comment-include-schema';
import { commentSortSchema } from './comment-sort-schema';

export const commentSearchSchema = z.object({
  ...cursorPaginationSchema.shape,
  sort: commentSortSchema.optional(),
  include: commentIncludeSchema.optional(),
});
