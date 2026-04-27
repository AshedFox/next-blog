'use cache: private';

import { CommentVoteGetManyDto } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import { fetchOwnCommentsVotes, fetchOwnCommentVote } from './server-transport';

export async function getOwnCommentVote(commentId: string, userId: string) {
  cacheTag(`users-${userId}-comments-${commentId}-votes`);

  return fetchOwnCommentVote(commentId);
}

export async function getOwnCommentVotes(
  userId: string,
  query: Partial<CommentVoteGetManyDto>
) {
  cacheTag(`users-${userId}-comments-votes`);

  return fetchOwnCommentsVotes(query);
}
