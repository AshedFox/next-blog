'use cache: private';

import { ArticleModerationGetManyDto } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import { fetchArticleModerationLogs } from './server-transport';

export async function getArticleModerationLogs(
  articleId: string,
  query: Partial<ArticleModerationGetManyDto>
) {
  cacheTag(`articles-${articleId}-logs`);

  return fetchArticleModerationLogs(articleId, query);
}
