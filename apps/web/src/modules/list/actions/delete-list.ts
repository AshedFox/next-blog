'use server';

import { revalidateTag, updateTag } from 'next/cache';

import { deleteList } from '../api/server-transport';

export async function deleteListAction(listId: string) {
  const { data, error } = await deleteList(listId);

  if (error) {
    return { error };
  }

  revalidateTag(`users-${data.userId}-lists`, 'max');
  updateTag(`lists-${listId}`);

  return { data };
}
