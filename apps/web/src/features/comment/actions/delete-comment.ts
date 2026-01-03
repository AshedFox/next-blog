'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { deleteComment } from '../server';

export async function deleteCommentAction(id: string) {
  const { data, error } = await deleteComment(id);

  if (error) {
    return { error };
  }

  updateTag(`comments-${data.id}`);
  revalidateTag(`articles-${data.articleId}-comments`, 'max');

  return { data };
}
