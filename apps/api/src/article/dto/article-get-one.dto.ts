import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';

import { TransformInclude, ValidateRelations } from '@/common/search';

import { ARTICLE_SEARCH_CONFIG } from '../article-search.config';

export class ArticleGetOneDto {
  @IsOptional()
  @TransformInclude<Prisma.ArticleInclude>()
  @ValidateRelations<Prisma.ArticleInclude>(ARTICLE_SEARCH_CONFIG)
  include: (keyof Prisma.ArticleInclude)[] = [];
}
