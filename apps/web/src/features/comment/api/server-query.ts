import { CommentSearch } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import { fetchArticleCommentsList } from './server-transport';

export async function searchArticleComments(
  id: string,
  query: Partial<CommentSearch>
) {
  'use cache';
  cacheTag(`articles-${id}-comments`);

  return fetchArticleCommentsList(id, query);
}
