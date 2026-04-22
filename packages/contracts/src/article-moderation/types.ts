import z from 'zod';

import { ArticleModerationInclude } from './enums';
import {
  articleModerationGetManyResponseSchema,
  articleModerationGetManySchema,
  articleModerationSchema,
  baseArticleModerationSchema,
  createArticleModearationWithRelationsSchema,
} from './schemas';

export type BaseArticleModerationDto = z.infer<
  typeof baseArticleModerationSchema
>;
export type ArticleModerationDto = z.infer<typeof articleModerationSchema>;
export type ArticleModerationInDto = z.input<typeof articleModerationSchema>;
export type ArticleModerationWithRelationsDto<
  T extends readonly ArticleModerationInclude[],
> = z.infer<ReturnType<typeof createArticleModearationWithRelationsSchema<T>>>;
export type ArticleModerationGetManyDto = z.infer<
  typeof articleModerationGetManySchema
>;
export type ArticleModerationGetManyResponseDto = z.infer<
  typeof articleModerationGetManyResponseSchema
>;
