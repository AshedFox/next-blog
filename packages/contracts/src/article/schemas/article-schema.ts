import z from 'zod';

import { baseCommentSchema } from '../../comment';
import { datetimeOutSchema } from '../../common';
import { baseUserSchema } from '../../user';
import { ArticleInclude, ArticleStatus } from '../enums';
import { ArticleDto } from '../types';
import { articleBlockSchema } from './article-blocks-schemas';

export const baseArticleSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  status: z.enum(ArticleStatus),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
  authorId: z.uuid(),
  blocks: z.array(articleBlockSchema),
});

export const articleSchema = baseArticleSchema.extend({
  author: z.lazy(() => baseUserSchema).optional(),
  comments: z.lazy(() => z.array(baseCommentSchema)).optional(),
});

export function createArticleWithRelationsSchema<
  T extends readonly ArticleInclude[],
>(
  include: T
): z.ZodType<
  ArticleDto & {
    [K in Extract<T[number], keyof ArticleDto>]-?: NonNullable<ArticleDto[K]>;
  }
> {
  const includeSet = new Set(include);

  return articleSchema.extend({
    author: includeSet.has('author')
      ? articleSchema.shape.author.unwrap()
      : articleSchema.shape.author,
    comments: includeSet.has('comments')
      ? articleSchema.shape.comments.unwrap()
      : articleSchema.shape.comments,
  }) as unknown as z.ZodType<
    ArticleDto & {
      [K in Extract<T[number], keyof ArticleDto>]-?: NonNullable<ArticleDto[K]>;
    }
  >;
}
