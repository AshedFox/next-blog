'use server';

import { UpdateListDto } from '@workspace/contracts';
import { revalidateTag, updateTag } from 'next/cache';

import { updateList } from '../api/server-transport';

export async function updateListAction(listId: string, input: UpdateListDto) {
  const { data, error } = await updateList(listId, input);

  if (error) {
    return { error };
  }

  revalidateTag(`users-${data.userId}-lists`, 'max');
  updateTag(`lists-${listId}`);

  return { data };
}
