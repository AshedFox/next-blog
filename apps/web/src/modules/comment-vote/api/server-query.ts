'use cache';

import { CommentsVotesTotalsArgsDto } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import {
  fetchCommentsVotesTotals,
  fetchCommentVotesTotal,
} from './server-transport';

export async function getCommentVotesTotal(commentId: string) {
  cacheTag(`comments-${commentId}-votes`);

  return fetchCommentVotesTotal(commentId);
}

export async function getCommentsVotesTotals(
  query: CommentsVotesTotalsArgsDto
) {
  cacheTag(`comments-votes`);

  return fetchCommentsVotesTotals(query);
}
