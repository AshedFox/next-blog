'use server';

import { CreateCommentDto } from '@workspace/contracts';
import { revalidateTag } from 'next/cache';

import { createComment } from '../server';

export async function createCommentAction(input: CreateCommentDto) {
  const { data, error } = await createComment(input);

  if (error) {
    return { error };
  }

  revalidateTag(`articles-${data.articleId}-comments`, 'max');

  return { data };
}
