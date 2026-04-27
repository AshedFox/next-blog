import {
  CommentsVotesTotalsArgsDto,
  commentsVotesTotalsArgsSchema,
  CommentsVotesTotalsDto,
  CommentVoteGetManyDto,
  CommentVoteGetManyResponseDto,
  commentVoteGetManySchema,
} from '@workspace/contracts';

import { clientApi } from '@/lib/api/client';
import { createApiSearchParams } from '@/lib/search-params';

export async function fetchOwnCommentsVotes(
  query: Partial<CommentVoteGetManyDto>
) {
  const search = await commentVoteGetManySchema.parseAsync(query);
  const searchParams = createApiSearchParams(search);

  return clientApi.getOrThrow<CommentVoteGetManyResponseDto>(
    `/api/users/me/comments/votes?${searchParams.toString()}`
  );
}
export async function fetchCommentsVotesTotals(
  args: CommentsVotesTotalsArgsDto
) {
  const search = await commentsVotesTotalsArgsSchema.parseAsync(args);
  const searchParams = createApiSearchParams(search);

  return clientApi.getOrThrow<CommentsVotesTotalsDto>(
    `/api/comments/votes/total?${searchParams.toString()}`
  );
}
