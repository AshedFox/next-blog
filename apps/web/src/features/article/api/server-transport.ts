import 'server-only';

import {
  ArticleDto,
  ArticleInclude,
  ArticleWithRelationsDto,
  CreateArticleDto,
  UpdateArticleDto,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';

export function createArticle(input: CreateArticleDto) {
  return serverApi.post<ArticleDto>('/api/articles', input, true);
}

export function updateArticle(id: string, input: UpdateArticleDto) {
  return serverApi.patch<ArticleDto>(`/api/articles/${id}`, input, true);
}

export function deleteArticle(id: string) {
  return serverApi.delete<ArticleDto>(`/api/articles/${id}`, true);
}

export function fetchArticle<R extends readonly ArticleInclude[]>(
  slugOrId: string,
  include?: R
) {
  return serverApi.get<ArticleWithRelationsDto<R>>(
    `/api/articles/${slugOrId}${include ? `?include=${include}` : ''}`
  );
}
