'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { deleteArticleVote } from '../server';

export async function deleteArticleVoteAction(articleId: string) {
  const { data, error } = await deleteArticleVote(articleId);

  if (error) {
    return { error };
  }

  updateTag(`users-${data.userId}-articles-${data.articleId}-votes`);
  revalidateTag(`users-${data.userId}-articles-votes`, 'max');
  revalidateTag(`articles-${data.articleId}-votes`, 'max');

  return { data };
}
