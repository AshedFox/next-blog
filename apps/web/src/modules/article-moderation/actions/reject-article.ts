'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { rejectArticle } from '../api/server-transport';

export async function rejectArticleAction(id: string, reason: string) {
  const { data, error } = await rejectArticle(id, reason);

  if (error) {
    return { error };
  }

  updateTag(`articles-${data.id}`);
  updateTag(`articles-${data.slug}`);
  updateTag(`articles-${data.id}-logs`);
  revalidateTag('articles', 'max');

  return { data };
}
