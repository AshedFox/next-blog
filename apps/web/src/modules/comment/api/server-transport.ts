import {
  CommentDto,
  CommentInclude,
  CommentSearch,
  CommentSearchResponseDto,
  commentSearchSchema,
  CommentWithRelationsDto,
  CreateCommentDto,
  UpdateCommentDto,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';

import { createCommentSearchParams } from '../utils';

export function createComment(input: CreateCommentDto) {
  return serverApi.post<CommentDto>('/api/comments', input, true);
}

export function updateComment(id: string, input: UpdateCommentDto) {
  return serverApi.patch<CommentDto>(`/api/comments/${id}`, input, true);
}

export function deleteComment(id: string) {
  return serverApi.delete<CommentDto>(`/api/comments/${id}`, true);
}

export function fetchComment<R extends readonly CommentInclude[]>(
  slugOrId: string,
  include?: R
) {
  return serverApi.get<CommentWithRelationsDto<R>>(
    `/api/comments/${slugOrId}${include ? `?include=${include}` : ''}`
  );
}

export async function fetchArticleCommentsList(
  id: string,
  query: Partial<CommentSearch>
) {
  const search = await commentSearchSchema.parseAsync(query);
  const searchParams = createCommentSearchParams(search);

  return serverApi.get<CommentSearchResponseDto>(
    `/api/articles/${id}/comments?${searchParams.toString()}`
  );
}
