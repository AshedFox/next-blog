'use server';

import { UpdateCommentDto } from '@workspace/contracts';
import { revalidateTag, updateTag } from 'next/cache';

import { updateComment } from '../server';

export async function editCommentAction(id: string, input: UpdateCommentDto) {
  const { data, error } = await updateComment(id, input);

  if (error) {
    return { error };
  }

  updateTag(`comments-${data.id}`);
  revalidateTag(`articles-${data.articleId}-comments`, 'max');

  return { data };
}
