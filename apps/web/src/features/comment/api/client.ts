import {
  CommentSearch,
  CommentSearchResponseDto,
  commentSearchSchema,
} from '@workspace/contracts';

import { createCommentSearchParams } from '@/features/comment/utils';
import { clientApi } from '@/lib/api/client';

export async function fetchArticleCommentsList(
  id: string,
  query: Partial<CommentSearch>
) {
  const search = await commentSearchSchema.parseAsync(query);
  const searchParams = createCommentSearchParams(search);

  return clientApi.getOrThrow<CommentSearchResponseDto>(
    `/api/articles/${id}/comments?${searchParams.toString()}`
  );
}
