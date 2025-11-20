import z from 'zod';

import { datetimeOutSchema } from '../../common';
import { baseUserSchema } from '../../user';
import { ArticleInclude, ArticleStatus } from '../enums';
import { ArticleDto } from '../types';
import { articleBlockSchema } from './article-blocks-schemas';

export const baseArticleSchema = z.object({
  id: z.uuid(),
  title: z.string().min(2).max(120),
  status: z.enum(ArticleStatus),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
  authorId: z.uuid(),
  blocks: z.array(articleBlockSchema).max(20),
});

export const articleSchema = baseArticleSchema.extend({
  author: z.lazy(() => baseUserSchema).optional(),
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
  }) as unknown as z.ZodType<
    ArticleDto & {
      [K in Extract<T[number], keyof ArticleDto>]-?: NonNullable<ArticleDto[K]>;
    }
  >;
}
