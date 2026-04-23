'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { downvoteArticle } from '../server';

export async function downvoteArticleAction(articleId: string) {
  const { data, error } = await downvoteArticle(articleId);

  if (error) {
    return { error };
  }

  updateTag(`users-${data.userId}-articles-${data.articleId}-votes`);
  revalidateTag(`users-${data.userId}-articles-votes`, 'max');
  revalidateTag(`articles-${data.articleId}-votes`, 'max');

  return { data };
}
