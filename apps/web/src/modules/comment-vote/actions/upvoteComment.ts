'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { upvoteComment } from '../server';

export async function upvoteCommentAction(commentId: string) {
  const { data, error } = await upvoteComment(commentId);

  if (error) {
    return { error };
  }

  updateTag(`users-${data.userId}-comments-${data.commentId}-votes`);
  revalidateTag(`users-${data.userId}-comments-votes`, 'max');
  revalidateTag(`comments-${data.commentId}-votes`, 'max');

  return { data };
}
