import 'server-only';

import {
  CommentsVotesTotalsArgsDto,
  commentsVotesTotalsArgsSchema,
  CommentVoteDto,
  CommentVoteGetManyDto,
  CommentVoteGetManyResponseDto,
  commentVoteGetManySchema,
  CommentVotesTotalDto,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';
import { createApiSearchParams } from '@/lib/search-params';

export function fetchOwnCommentVote(commentId: string) {
  return serverApi.get<CommentVoteDto>(
    `/api/users/me/comments/${commentId}/votes`,
    true
  );
}

export async function fetchOwnCommentsVotes(
  query: Partial<CommentVoteGetManyDto>
) {
  const search = await commentVoteGetManySchema.parseAsync(query);
  const searchParams = createApiSearchParams(search);

  return serverApi.get<CommentVoteGetManyResponseDto>(
    `/api/users/me/comments/votes?${searchParams.toString()}`,
    true
  );
}

export function fetchCommentVotesTotal(commentId: string) {
  return serverApi.get<CommentVotesTotalDto>(
    `/api/comments/${commentId}/votes/total`
  );
}

export async function fetchCommentsVotesTotals(
  args: CommentsVotesTotalsArgsDto
) {
  const search = await commentsVotesTotalsArgsSchema.parseAsync(args);
  const searchParams = createApiSearchParams(search);

  return serverApi.get<CommentVotesTotalDto>(
    `/api/comments/votes/total?${searchParams.toString()}`
  );
}

export function upvoteComment(commentId: string) {
  return serverApi.post<CommentVoteDto>(
    `/api/comments/${commentId}/votes/upvote`,
    undefined,
    true
  );
}

export function downvoteComment(commentId: string) {
  return serverApi.post<CommentVoteDto>(
    `/api/comments/${commentId}/votes/downvote`,
    undefined,
    true
  );
}

export function deleteCommentVote(commentId: string) {
  return serverApi.delete<CommentVoteDto>(
    `/api/comments/${commentId}/votes`,
    true
  );
}
