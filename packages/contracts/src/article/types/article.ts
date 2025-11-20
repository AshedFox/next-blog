import z from 'zod';

import { ArticleInclude } from '../enums';
import {
  articleSchema,
  baseArticleSchema,
  createArticleWithRelationsSchema,
} from '../schemas';

export type BaseArticleDto = z.infer<typeof baseArticleSchema>;

export type ArticleDto = z.infer<typeof articleSchema>;

export type ArticleInDto = z.input<typeof articleSchema>;

export type ArticleWithRelationsDto<T extends readonly ArticleInclude[]> =
  z.infer<ReturnType<typeof createArticleWithRelationsSchema<T>>>;
