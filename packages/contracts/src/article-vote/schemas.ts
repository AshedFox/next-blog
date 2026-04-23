import z from 'zod';

import { baseArticleSchema } from '../article/schemas';
import {
  createIncludeSchema,
  createPaginatedResponseSchema,
  datetimeOutSchema,
  offsetPaginationSchema,
} from '../common';
import { baseUserSchema } from '../user';
import { ArticleVoteInclude } from './enums';
import { ArticleVoteDto } from './types';

export const baseArticleVoteSchema = z.object({
  id: z.uuid(),
  value: z.int(),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  userId: z.uuid(),
  articleId: z.uuid(),
});

export const articleVoteSchema = baseArticleVoteSchema.extend({
  user: z.lazy(() => baseUserSchema).optional(),
  article: z.lazy(() => baseArticleSchema).optional(),
});

export const articleVotesTotalSchema = z.object({
  total: z.int(),
});

export const articleVoteIncludeSchema = createIncludeSchema(ArticleVoteInclude);

export function createArticleVoteWithRelationsSchema<
  T extends readonly ArticleVoteInclude[],
>(include: T) {
  const overrides = include.reduce(
    (acc, item) => ({
      ...acc,
      [item]: articleVoteSchema.shape[item].unwrap(),
    }),
    {}
  );

  return articleVoteSchema.extend(overrides) as unknown as z.ZodType<
    ArticleVoteDto & {
      [K in Extract<T[number], keyof ArticleVoteDto>]-?: NonNullable<
        ArticleVoteDto[K]
      >;
    }
  >;
}

export const articleVoteGetManySchema = z.object({
  ...offsetPaginationSchema.shape,
  include: articleVoteIncludeSchema,
});

export const articleVoteGetManyResponseSchema =
  createPaginatedResponseSchema(articleVoteSchema);
