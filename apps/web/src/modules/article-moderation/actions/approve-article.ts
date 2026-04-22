'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { approveArticle } from '../api/server-transport';

export async function approveArticleAction(id: string) {
  const { data, error } = await approveArticle(id);

  if (error) {
    return { error };
  }

  updateTag(`articles-${data.id}`);
  updateTag(`articles-${data.slug}`);
  updateTag(`articles-${data.id}-logs`);
  revalidateTag('articles', 'max');

  return { data };
}
