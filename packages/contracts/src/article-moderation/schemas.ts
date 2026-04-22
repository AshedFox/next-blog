import z from 'zod';

import { ArticleStatus } from '../article/enums';
import { baseArticleSchema } from '../article/schemas';
import {
  createIncludeSchema,
  createPaginatedResponseSchema,
  datetimeOutSchema,
  offsetPaginationSchema,
} from '../common';
import { baseUserSchema } from '../user';
import { ArticleModerationInclude } from './enums';
import { ArticleModerationDto } from './types';

export const baseArticleModerationSchema = z.object({
  id: z.uuid(),
  articleId: z.uuid(),
  statusTo: z.enum(ArticleStatus),
  reason: z.string().nullish(),
  adminId: z.uuid().nullish(),
  createdAt: datetimeOutSchema,
});

export const articleModerationSchema = baseArticleModerationSchema.extend({
  admin: z.lazy(() => baseUserSchema).optional(),
  article: z.lazy(() => baseArticleSchema).optional(),
});

export const articleModerationIncludeSchema = createIncludeSchema(
  ArticleModerationInclude
).catch([]);

export function createArticleModearationWithRelationsSchema<
  T extends readonly ArticleModerationInclude[],
>(include: T) {
  const overrides = include.reduce(
    (acc, item) => ({
      ...acc,
      [item]: articleModerationSchema.shape[item].unwrap(),
    }),
    {}
  );

  return articleModerationSchema.extend(overrides) as unknown as z.ZodType<
    ArticleModerationDto & {
      [K in Extract<T[number], keyof ArticleModerationDto>]-?: NonNullable<
        ArticleModerationDto[K]
      >;
    }
  >;
}

export const articleModerationGetManySchema = z.object({
  ...offsetPaginationSchema.shape,
  include: articleModerationIncludeSchema,
});

export const articleModerationGetManyResponseSchema =
  createPaginatedResponseSchema(articleModerationSchema);
