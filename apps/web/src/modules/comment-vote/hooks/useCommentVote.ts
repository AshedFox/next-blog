'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CommentVoteDto,
  CommentVoteGetManyResponseDto,
} from '@workspace/contracts';
import { toast } from 'sonner';

import {
  deleteCommentVoteAction,
  downvoteCommentAction,
  upvoteCommentAction,
} from '../client';

type ActionResult = { data?: CommentVoteDto; error?: { message: string } };

type VoteContext = {
  previousTotals: [queryKey: unknown[], data: unknown][];
  previousUserVotes: [queryKey: unknown[], data: unknown][];
};

export function useCommentVote(
  commentId: string,
  currentUserId?: string,
  currentVote?: CommentVoteDto
) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['comments-votes-totals'] });
    if (currentUserId) {
      queryClient.invalidateQueries({
        queryKey: ['users', currentUserId, 'comments-votes'],
      });
    }
  };

  const buildMutationOptions = (
    mutationFn: () => Promise<ActionResult>,
    newVoteValue: number | null
  ) => {
    const currentValue = currentVote?.value ?? 0;
    const delta = (newVoteValue ?? 0) - currentValue;

    return {
      mutationFn,
      onMutate: async (): Promise<VoteContext> => {
        await queryClient.cancelQueries({
          queryKey: ['comments-votes-totals'],
        });
        if (currentUserId) {
          await queryClient.cancelQueries({
            queryKey: ['users', currentUserId, 'comments-votes'],
          });
        }

        const previousTotals = queryClient.getQueriesData<
          Record<string, number>
        >({ queryKey: ['comments-votes-totals'] });

        const previousUserVotes = currentUserId
          ? queryClient.getQueriesData<CommentVoteGetManyResponseDto>({
              queryKey: ['users', currentUserId, 'comments-votes'],
            })
          : [];

        queryClient.setQueriesData<Record<string, number>>(
          { queryKey: ['comments-votes-totals'] },
          (old) => {
            if (!old || !(commentId in old)) return old;
            return { ...old, [commentId]: (old[commentId] ?? 0) + delta };
          }
        );

        if (currentUserId) {
          queryClient.setQueriesData<CommentVoteGetManyResponseDto>(
            { queryKey: ['users', currentUserId, 'comments-votes'] },
            (old) => {
              if (!old) return old;

              if (newVoteValue === null) {
                return {
                  ...old,
                  data: old.data.filter((v) => v.commentId !== commentId),
                };
              }

              return {
                ...old,
                data: old.data.map((v) =>
                  v.commentId === commentId ? { ...v, value: newVoteValue } : v
                ),
              };
            }
          );
        }

        return {
          previousTotals: previousTotals as VoteContext['previousTotals'],
          previousUserVotes:
            previousUserVotes as VoteContext['previousUserVotes'],
        };
      },
      onError: (_err: unknown, _vars: void, context?: VoteContext) => {
        if (context) {
          context.previousTotals.forEach(([key, data]) =>
            queryClient.setQueryData(key as string[], data)
          );
          context.previousUserVotes.forEach(([key, data]) =>
            queryClient.setQueryData(key as string[], data)
          );
        }
        toast.error('Something went wrong!');
      },
      onSuccess: ({ error }: ActionResult) => {
        if (error) {
          toast.error(error.message);
        }
      },
      onSettled: invalidate,
    };
  };

  const upvoteMutation = useMutation(
    buildMutationOptions(() => upvoteCommentAction(commentId), 1)
  );
  const downvoteMutation = useMutation(
    buildMutationOptions(() => downvoteCommentAction(commentId), -1)
  );
  const deleteMutation = useMutation(
    buildMutationOptions(() => deleteCommentVoteAction(commentId), null)
  );

  return {
    upvote: upvoteMutation.mutate,
    downvote: downvoteMutation.mutate,
    deleteVote: deleteMutation.mutate,
    isPending:
      upvoteMutation.isPending ||
      downvoteMutation.isPending ||
      deleteMutation.isPending,
  };
}
