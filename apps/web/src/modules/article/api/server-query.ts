'use cache';

import { ArticleInclude, ArticleSearch } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import { fetchArticle, fetchArticleList } from './server-transport';

export async function getArticle(
  slugOrId: string,
  include: ArticleInclude[] = ['tags', 'author']
) {
  cacheTag(`articles-${slugOrId}`);

  return fetchArticle(slugOrId, include);
}

export async function searchArticles(query: Partial<ArticleSearch>) {
  cacheTag('articles');

  return fetchArticleList(query);
}
