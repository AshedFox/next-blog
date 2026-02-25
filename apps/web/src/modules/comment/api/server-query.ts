import { CommentSearch } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import {
  fetchArticleCommentsList,
  fetchUserCommentsList,
} from './server-transport';

export async function searchArticleComments(
  id: string,
  query: Partial<CommentSearch>
) {
  'use cache';
  cacheTag(`articles-${id}-comments`);

  return fetchArticleCommentsList(id, query);
}

export async function searchUserComments(
  userId: string,
  query: Partial<CommentSearch>
) {
  'use cache';
  cacheTag(`users-${userId}-comments`);

  return fetchUserCommentsList(userId, query);
}
