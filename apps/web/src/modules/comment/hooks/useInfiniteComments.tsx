'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  CommentSearchResponseDto,
  CursorPagination,
} from '@workspace/contracts';

import { fetchArticleCommentsList } from '../client';

export function useInfiniteComments(
  articleId: string,
  initialData: CommentSearchResponseDto
) {
  return useInfiniteQuery({
    queryKey: ['articles', articleId, 'comments'],
    queryFn: async ({ pageParam }) =>
      fetchArticleCommentsList(articleId, {
        include: ['author'],
        cursor: pageParam,
      }),
    initialData: {
      pages: [initialData],
      pageParams: [(initialData.meta as CursorPagination).cursor],
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.meta as CursorPagination).cursor,
  });
}
