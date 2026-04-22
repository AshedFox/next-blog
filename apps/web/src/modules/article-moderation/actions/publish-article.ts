'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { publishArticle } from '../api/server-transport';

export async function publishArticleAction(id: string) {
  const { data, error } = await publishArticle(id);

  if (error) {
    return { error };
  }

  updateTag(`articles-${data.id}`);
  updateTag(`articles-${data.slug}`);
  updateTag(`articles-${data.id}-logs`);
  revalidateTag('articles', 'max');

  return { data };
}
