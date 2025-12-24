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
>(
  include: T
): z.ZodType<
  CommentDto & {
    [K in Extract<T[number], keyof CommentDto>]-?: NonNullable<CommentDto[K]>;
  }
> {
  const includeSet = new Set(include);

  return commentSchema.extend({
    author: includeSet.has('author')
      ? commentSchema.shape.author.unwrap()
      : commentSchema.shape.author,
    article: includeSet.has('article')
      ? commentSchema.shape.article.unwrap()
      : commentSchema.shape.article,
    replies: includeSet.has('replies')
      ? commentSchema.shape.replies.unwrap()
      : commentSchema.shape.replies,
    replyTo: includeSet.has('replyTo')
      ? commentSchema.shape.replyTo.unwrap()
      : commentSchema.shape.replyTo,
  }) as unknown as z.ZodType<
    CommentDto & {
      [K in Extract<T[number], keyof CommentDto>]-?: NonNullable<CommentDto[K]>;
    }
  >;
}
