'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { downvoteComment } from '../server';

export async function downvoteCommentAction(commentId: string) {
  const { data, error } = await downvoteComment(commentId);

  if (error) {
    return { error };
  }

  updateTag(`users-${data.userId}-comments-${data.commentId}-votes`);
  revalidateTag(`users-${data.userId}-comments-votes`, 'max');
  revalidateTag(`comments-${data.commentId}-votes`, 'max');

  return { data };
}
