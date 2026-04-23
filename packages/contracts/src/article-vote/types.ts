import z from 'zod';

import { ArticleVoteInclude } from './enums';
import {
  articleVoteGetManyResponseSchema,
  articleVoteGetManySchema,
  articleVoteSchema,
  articleVotesTotalSchema,
  baseArticleVoteSchema,
  createArticleVoteWithRelationsSchema,
} from './schemas';

export type BaseArticleVoteDto = z.infer<typeof baseArticleVoteSchema>;
export type ArticleVoteDto = z.infer<typeof articleVoteSchema>;
export type ArticleVotesTotalDto = z.infer<typeof articleVotesTotalSchema>;
export type ArticleVoteWithRelationsDto<
  T extends readonly ArticleVoteInclude[],
> = z.infer<ReturnType<typeof createArticleVoteWithRelationsSchema<T>>>;
export type ArticleVoteGetManyDto = z.infer<typeof articleVoteGetManySchema>;
export type ArticleVoteGetManyResponseDto = z.infer<
  typeof articleVoteGetManyResponseSchema
>;
