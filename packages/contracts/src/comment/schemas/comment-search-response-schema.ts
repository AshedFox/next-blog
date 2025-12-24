import { createPaginatedResponseSchema } from '../../common';
import { commentSchema } from './comment-schema';

export const commentSearchResponseSchema =
  createPaginatedResponseSchema(commentSchema);
