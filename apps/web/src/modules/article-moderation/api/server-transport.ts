import 'server-only';

import {
  ArticleDto,
  ArticleModerationGetManyDto,
  ArticleModerationGetManyResponseDto,
  articleModerationGetManySchema,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';
import { createApiSearchParams } from '@/lib/search-params';

export function publishArticle(id: string) {
  return serverApi.post<ArticleDto>(
    `/api/articles/${id}/request-publish`,
    undefined,
    true
  );
}

export function approveArticle(id: string) {
  return serverApi.post<ArticleDto>(
    `/api/articles/${id}/approve`,
    undefined,
    true
  );
}

export function rejectArticle(id: string, reason: string) {
  return serverApi.post<ArticleDto>(
    `/api/articles/${id}/reject`,
    { reason },
    true
  );
}

export async function fetchArticleModerationLogs(
  articleId: string,
  query: Partial<ArticleModerationGetManyDto>
) {
  const search = await articleModerationGetManySchema.parseAsync(query);
  const searchParams = createApiSearchParams(search);

  return serverApi.get<ArticleModerationGetManyResponseDto>(
    `/api/articles/${articleId}/moderation-logs?${searchParams.toString()}`,
    true
  );
}
