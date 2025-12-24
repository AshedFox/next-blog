import z from 'zod';

import { CommentInclude } from '../enums';
import {
  baseCommentSchema,
  commentSchema,
  createCommentWithRelationsSchema,
} from '../schemas';

export type BaseCommentDto = z.infer<typeof baseCommentSchema>;

export type CommentDto = z.infer<typeof commentSchema>;

export type CommentInDto = z.input<typeof commentSchema>;

export type CommentWithRelationsDto<T extends readonly CommentInclude[]> =
  z.infer<ReturnType<typeof createCommentWithRelationsSchema<T>>>;
