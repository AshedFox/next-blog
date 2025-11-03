import { Article, ArticleStatus, Prisma } from '@prisma/client';

import { EntitySearchConfig } from '@/common/search';

export const ARTICLE_SEARCH_CONFIG: EntitySearchConfig<
  Article,
  Prisma.ArticleInclude
> = {
  searchableFields: ['title'],
  filterableFields: {
    title: { type: 'string', operators: true },
    createdAt: { type: 'date', operators: true },
    updatedAt: { type: 'date', operators: true },
    status: { type: 'enum', enumValues: ArticleStatus },
  },
  sortableFields: ['title', 'createdAt', 'updatedAt'],
  relations: ['author'],
};
