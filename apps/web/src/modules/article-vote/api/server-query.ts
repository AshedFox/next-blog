import { cacheTag } from 'next/cache';

import {
  fetchArticleVotesTotal,
  fetchOwnArticleVote,
  fetchOwnArticleVotes,
} from './server-transport';

export async function getOwnArticleVote(articleId: string, userId: string) {
  'use cache: private';
  cacheTag(`users-${userId}-articles-${articleId}-votes`);

  return fetchOwnArticleVote(articleId);
}

export async function getArticleVotesTotal(articleId: string) {
  'use cache';
  cacheTag(`articles-${articleId}-votes`);

  return fetchArticleVotesTotal(articleId);
}

export async function getOwnArticleVotes(userId: string) {
  'use cache: private';
  cacheTag(`users-${userId}-articles-votes`);

  return fetchOwnArticleVotes();
}
