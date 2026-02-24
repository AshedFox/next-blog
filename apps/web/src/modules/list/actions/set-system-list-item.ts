'use server';

import { ListItemDto, SystemListType } from '@workspace/contracts';
import { revalidateTag, updateTag } from 'next/cache';

import { ApiFetchResult } from '@/lib/api/types';
import { getMe } from '@/modules/user/server';

import {
  createSystemListItem,
  deleteSystemListItem,
} from '../api/server-transport';

export async function setSystemListItemAction(
  articleId: string,
  type: SystemListType,
  shouldBeChecked: boolean
) {
  const user = await getMe();

  if (!user) {
    return { error: { status: 401, message: 'Unauthorized' } };
  }

  let result: ApiFetchResult<ListItemDto>;

  if (shouldBeChecked) {
    result = await createSystemListItem(articleId, type);
  } else {
    result = await deleteSystemListItem(articleId, type);
  }

  if (!result.error) {
    revalidateTag(`lists-${result.data.id}`, 'max');
    updateTag(`users-${user.id}-articles-${articleId}-lists`);
  }

  return result;
}
