'use client';

import { useQueries } from '@tanstack/react-query';

import { fetchCommentsVotesTotals, fetchOwnCommentsVotes } from '../client';

export function useCommentsVotes(
  pagesCommentsIds: string[][],
  currentUserId?: string
) {
  const votesTotals = useQueries({
    queries: pagesCommentsIds.map((commentsIds) => ({
      queryKey: ['comments-votes-totals', commentsIds],
      queryFn: () => fetchCommentsVotesTotals({ commentsIds }),
      enabled: commentsIds.length > 0,
    })),
    combine: (results) =>
      results.reduce(
        (acc, result) => Object.assign(acc, result.data ?? {}),
        {} as Record<string, number>
      ),
  });

  const userVotes = useQueries({
    queries: pagesCommentsIds.map((commentsIds) => ({
      queryKey: ['users', currentUserId, 'comments-votes', commentsIds],
      queryFn: () =>
        fetchOwnCommentsVotes({ commentsIds, limit: commentsIds.length }),
      enabled: !!currentUserId && commentsIds.length > 0,
    })),
    combine: (results) =>
      Object.fromEntries(
        results.flatMap((r) =>
          (r.data?.data ?? []).map((v) => [v.commentId, v])
        )
      ),
  });

  return { votesTotals, userVotes };
}
