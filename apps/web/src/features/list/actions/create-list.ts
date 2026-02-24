'use server';

import { CreateListDto } from '@workspace/contracts';
import { revalidateTag } from 'next/cache';

import { createList } from '../api/server-transport';

export async function createListAction(input: CreateListDto) {
  const { data, error } = await createList(input);

  if (error) {
    return { error };
  }

  revalidateTag(`users-${data.userId}-lists`, 'max');

  return { data };
}
