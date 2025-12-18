'use server';

import { CreateArticleDto } from '@workspace/contracts';
import { revalidateTag } from 'next/cache';

import { createArticle } from '../server';

export async function createArticleAction(input: CreateArticleDto) {
  const { data, error } = await createArticle(input);

  if (error) {
    return { error };
  }

  revalidateTag('articles', 'max');

  return { data };
}
