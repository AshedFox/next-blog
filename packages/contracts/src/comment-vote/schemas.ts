import z from 'zod';

import { baseCommentSchema } from '../comment/schemas';
import {
  createArrayFilterSchema,
  createIncludeSchema,
  createPaginatedResponseSchema,
  datetimeOutSchema,
  offsetPaginationSchema,
} from '../common';
import { baseUserSchema } from '../user';
import { CommentVoteInclude } from './enums';
import { CommentVoteDto } from './types';

export const baseCommentVoteSchema = z.object({
  id: z.uuid(),
  value: z.int(),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  userId: z.uuid(),
  commentId: z.uuid(),
});

export const commentVoteSchema = baseCommentVoteSchema.extend({
  user: z.lazy(() => baseUserSchema).optional(),
  comment: z.lazy(() => baseCommentSchema).optional(),
});

export const commentVotesTotalSchema = z.object({
  total: z.int(),
});

export const commentsVotesTotalsArgsSchema = z.object({
  commentsIds: createArrayFilterSchema(z.array(z.uuid()).min(1).max(50)),
});

export const commentsVotesTotalsSchema = z.record(z.uuid(), z.int());

export const commentVoteIncludeSchema = createIncludeSchema(CommentVoteInclude);

export function createCommentVoteWithRelationsSchema<
  T extends readonly CommentVoteInclude[],
>(include: T) {
  const overrides = include.reduce(
    (acc, item) => ({
      ...acc,
      [item]: commentVoteSchema.shape[item].unwrap(),
    }),
    {}
  );

  return commentVoteSchema.extend(overrides) as unknown as z.ZodType<
    CommentVoteDto & {
      [K in Extract<T[number], keyof CommentVoteDto>]-?: NonNullable<
        CommentVoteDto[K]
      >;
    }
  >;
}

export const commentVoteGetManySchema = z.object({
  ...offsetPaginationSchema.shape,
  include: commentVoteIncludeSchema.optional(),
  commentsIds: createArrayFilterSchema(z.array(z.uuid())).optional(),
});

export const commentVoteGetManyResponseSchema =
  createPaginatedResponseSchema(commentVoteSchema);
