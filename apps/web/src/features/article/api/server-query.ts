import { ArticleSearch, ArticleWithRelationsDto } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import { ApiFetchResult } from '@/lib/api/types';

import { fetchArticle, fetchArticleList } from './server-transport';

export async function getArticle(
  slugOrId: string
): Promise<ApiFetchResult<ArticleWithRelationsDto<['author']>>> {
  'use cache';
  cacheTag(`articles-${slugOrId}`);

  return fetchArticle(slugOrId, ['author']);
}

export async function searchArticles(query: ArticleSearch) {
  'use cache';
  cacheTag('articles');

  return fetchArticleList(query);
}
