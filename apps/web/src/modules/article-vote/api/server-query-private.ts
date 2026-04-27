'use cache: private';

import { cacheTag } from 'next/cache';

import { fetchOwnArticleVote, fetchOwnArticleVotes } from './server-transport';

export async function getOwnArticleVote(articleId: string, userId: string) {
  cacheTag(`users-${userId}-articles-${articleId}-votes`);

  return fetchOwnArticleVote(articleId);
}

export async function getOwnArticleVotes(userId: string) {
  cacheTag(`users-${userId}-articles-votes`);

  return fetchOwnArticleVotes();
}
