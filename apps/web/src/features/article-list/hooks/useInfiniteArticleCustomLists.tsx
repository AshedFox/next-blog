import { useInfiniteQuery } from '@tanstack/react-query';
import { CursorPagination } from '@workspace/contracts';

import { fetchMyLists } from '@/features/list/client';

export function useInfiniteArticleCustomLists(
  articleId: string,
  enabled?: boolean
) {
  return useInfiniteQuery({
    queryKey: ['articles', articleId, 'lists', 'custom'],
    queryFn: ({ pageParam }) =>
      fetchMyLists({
        excludeArticlesIds: [articleId],
        systemType: null,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return (lastPage.meta as CursorPagination).cursor;
    },
    enabled,
  });
}
