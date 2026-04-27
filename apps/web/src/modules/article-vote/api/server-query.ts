'use cache';

import { cacheTag } from 'next/cache';

import { fetchArticleVotesTotal } from './server-transport';

export async function getArticleVotesTotal(articleId: string) {
  cacheTag(`articles-${articleId}-votes`);

  return fetchArticleVotesTotal(articleId);
}
