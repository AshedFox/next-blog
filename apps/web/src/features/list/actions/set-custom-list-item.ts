'use server';

import { ListItemDto } from '@workspace/contracts';
import { revalidateTag, updateTag } from 'next/cache';

import { getMe } from '@/features/user/server';
import { ApiFetchResult } from '@/lib/api/types';

import { createListItem, deleteListItem } from '../api/server-transport';

export async function setCustomListItemAction(
  listId: string,
  articleId: string,
  shouldBeChecked: boolean
) {
  const user = await getMe();

  if (!user) {
    return { error: { status: 401, message: 'Unauthorized' } };
  }

  let result: ApiFetchResult<ListItemDto>;

  if (shouldBeChecked) {
    result = await createListItem(listId, articleId);
  } else {
    result = await deleteListItem(listId, articleId);
  }

  if (!result.error) {
    revalidateTag(`lists-${listId}`, 'max');
    updateTag(`users-${user.id}-articles-${articleId}-lists`);
  }

  return result;
}
