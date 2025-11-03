import { Article, Prisma } from '@prisma/client';

import {
  BaseSearchDto,
  ParsedFilters,
  SortField,
  ValidateFilters,
  ValidateRelations,
  ValidateSearch,
  ValidateSort,
} from '@/common/search';

import { ARTICLE_SEARCH_CONFIG } from '../article-search.config';

export class ArticleSearchDto extends BaseSearchDto<
  Article,
  Prisma.ArticleInclude
> {
  @ValidateSearch<Article>(ARTICLE_SEARCH_CONFIG)
  declare search?: string;

  @ValidateFilters<Article>(ARTICLE_SEARCH_CONFIG)
  declare filters: ParsedFilters<Article>;

  @ValidateSort<Article>(ARTICLE_SEARCH_CONFIG)
  declare sort: SortField<Article>[];

  @ValidateRelations<Prisma.ArticleInclude>(ARTICLE_SEARCH_CONFIG)
  declare include: (keyof Prisma.ArticleInclude)[];
}
