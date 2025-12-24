import z from 'zod';

import { baseArticleSchema } from '../../article';
import { datetimeOutSchema } from '../../common';
import { baseUserSchema } from '../../user';
import { CommentInclude } from '../enums';
import { CommentDto } from '../types';

export const baseCommentSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
  authorId: z.uuid(),
  articleId: z.uuid(),
  replyToId: z.uuid().nullish(),
});

export const commentSchema = baseCommentSchema.extend({
  author: z.lazy(() => baseUserSchema).optional(),
  article: z.lazy(() => baseArticleSchema).optional(),
  replies: z.lazy(() => z.array(baseCommentSchema)).optional(),
  replyTo: z.lazy(() => baseCommentSchema).optional(),
});

export function createCommentWithRelationsSchema<
  T extends readonly CommentInclude[],
>(include: T) {
  const overrides = include.reduce(
    (acc, item) => ({ ...acc, [item]: commentSchema.shape[item].unwrap() }),
    {}
  );

  return commentSchema.extend(overrides) as unknown as z.ZodType<
    CommentDto & {
      [K in Extract<T[number], keyof CommentDto>]-?: NonNullable<CommentDto[K]>;
    }
  >;
}
