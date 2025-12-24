import z from 'zod';

import { commentSearchResponseSchema } from '../schemas';

export type CommentSearchResponseDto = z.infer<
  typeof commentSearchResponseSchema
>;
