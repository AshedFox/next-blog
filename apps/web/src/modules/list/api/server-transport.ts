import 'server-only';

import {
  CreateListDto,
  ListDto,
  ListGetOneDto,
  listGetOneSchema,
  ListInclusionStateDto,
  ListItemDto,
  ListItemGetOneDto,
  listItemGetOneSchema,
  ListItemSearchDto,
  ListItemSearchResponseDto,
  listItemSearchSchema,
  ListSearchDto,
  ListSearchResponseDto,
  listSearchSchema,
  SystemListType,
  UpdateListDto,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';
import { createApiSearchParams } from '@/lib/search-params';

import { createListItemSearchParams, createListSearchParams } from '../utils';

export function createList(input: CreateListDto) {
  return serverApi.post<ListDto>('/api/lists', input, true);
}

export function fetchList(id: string, query: Partial<ListGetOneDto>) {
  const search = listGetOneSchema.parse(query);
  const searchParams = createApiSearchParams(search);

  return serverApi.get<ListDto>(
    `/api/lists/${id}?${searchParams.toString()}`,
    true
  );
}

export function updateList(id: string, input: UpdateListDto) {
  return serverApi.patch<ListDto>(`/api/lists/${id}`, input, true);
}

export function deleteList(id: string) {
  return serverApi.delete<ListDto>(`/api/lists/${id}`, true);
}

export function fetchMyLists(query: Partial<ListSearchDto>) {
  const search = listSearchSchema.parse(query);
  const searchParams = createListSearchParams(search);

  return serverApi.get<ListSearchResponseDto>(
    `/api/users/me/lists?${searchParams.toString()}`,
    true
  );
}

export function fetchUserLists(userId: string, query: Partial<ListSearchDto>) {
  const search = listSearchSchema.parse(query);
  const searchParams = createListSearchParams(search);

  return serverApi.get<ListSearchResponseDto>(
    `/api/users/${userId}/lists?${searchParams.toString()}`,
    true
  );
}

export function fetchListsInclusionState(articleId: string) {
  return serverApi.get<ListInclusionStateDto>(
    `/api/users/me/articles/${articleId}/lists/inclusion`,
    true
  );
}

export function createListItem(listId: string, articleId: string) {
  return serverApi.post<ListItemDto>(
    `/api/lists/${listId}/items/${articleId}`,
    {},
    true
  );
}

export function fetchListItem(
  listId: string,
  articleId: string,
  query: Partial<ListItemGetOneDto>
) {
  const search = listItemGetOneSchema.parse(query);
  const searchParams = createApiSearchParams(search);

  return serverApi.get<ListItemDto>(
    `/api/lists/${listId}/items/${articleId}?${searchParams.toString()}`,
    true
  );
}

export function fetchListItems(
  listId: string,
  query: Partial<ListItemSearchDto>
) {
  const search = listItemSearchSchema.parse(query);
  const searchParams = createListItemSearchParams(search);

  return serverApi.get<ListItemSearchResponseDto>(
    `/api/lists/${listId}/items?${searchParams.toString()}`,
    true
  );
}

export function deleteListItem(listId: string, articleId: string) {
  return serverApi.delete<ListItemDto>(
    `/api/lists/${listId}/items/${articleId}`,
    true
  );
}

export function createSystemListItem(articleId: string, type: SystemListType) {
  return serverApi.post<ListItemDto>(
    `/api/lists/system/${type}/items/${articleId}`,
    {},
    true
  );
}

export function deleteSystemListItem(articleId: string, type: SystemListType) {
  return serverApi.delete<ListItemDto>(
    `/api/lists/system/${type}/items/${articleId}`,
    true
  );
}
