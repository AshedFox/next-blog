'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { upvoteArticle } from '../server';

export async function upvoteArticleAction(articleId: string) {
  const { data, error } = await upvoteArticle(articleId);

  if (error) {
    return { error };
  }

  updateTag(`users-${data.userId}-articles-${data.articleId}-votes`);
  revalidateTag(`users-${data.userId}-articles-votes`, 'max');
  revalidateTag(`articles-${data.articleId}-votes`, 'max');

  return { data };
}
