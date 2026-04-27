'use cache: private';

import {
  ListGetOneDto,
  ListItemSearchDto,
  ListSearchDto,
} from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import {
  fetchList,
  fetchListItems,
  fetchListsInclusionState,
  fetchUserLists,
} from './server-transport';

export async function getList(id: string, query: Partial<ListGetOneDto>) {
  cacheTag(`lists-${id}`);

  return fetchList(id, query);
}

export async function searchUserLists(
  userId: string,
  query: Partial<ListSearchDto>
) {
  cacheTag(`users-${userId}-lists`);

  return fetchUserLists(userId, query);
}

export async function getListsInclusionState(
  userId: string,
  articleId: string
) {
  cacheTag(`users-${userId}-lists`);
  cacheTag(`users-${userId}-articles-${articleId}-lists`);

  return fetchListsInclusionState(articleId);
}

export async function searchListItems(
  listId: string,
  query: Partial<ListItemSearchDto>
) {
  cacheTag(`lists-${listId}`);

  return fetchListItems(listId, query);
}
