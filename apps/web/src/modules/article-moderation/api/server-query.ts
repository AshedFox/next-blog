import { ArticleModerationGetManyDto } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import { fetchArticleModerationLogs } from './server-transport';

export async function getArticleModerationLogs(
  articleId: string,
  query: Partial<ArticleModerationGetManyDto>
) {
  'use cache: private';
  cacheTag(`articles-${articleId}-logs`);

  return fetchArticleModerationLogs(articleId, query);
}
