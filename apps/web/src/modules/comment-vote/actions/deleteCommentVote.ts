'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { deleteCommentVote } from '../server';

export async function deleteCommentVoteAction(commentId: string) {
  const { data, error } = await deleteCommentVote(commentId);

  if (error) {
    return { error };
  }

  updateTag(`users-${data.userId}-comments-${data.commentId}-votes`);
  revalidateTag(`users-${data.userId}-comments-votes`, 'max');
  revalidateTag(`comments-${data.commentId}-votes`, 'max');

  return { data };
}
