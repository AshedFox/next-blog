'use server';

import { UpdateArticleDto } from '@workspace/contracts';
import { revalidateTag, updateTag } from 'next/cache';

import { updateArticle } from '../api/server-transport';

export async function editArticleAction(id: string, input: UpdateArticleDto) {
  const { data, error } = await updateArticle(id, input);

  if (error) {
    return { error };
  }

  updateTag(`articles-${data.id}`);
  updateTag(`articles-${data.slug}`);
  revalidateTag('articles', 'max');

  return { data };
}
