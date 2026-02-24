import {
  ListSearchDto,
  ListSearchResponseDto,
  listSearchSchema,
} from '@workspace/contracts';

import { clientApi } from '@/lib/api/client';

import { createListSearchParams } from '../utils';

export function fetchMyLists(query: Partial<ListSearchDto>) {
  const search = listSearchSchema.parse(query);
  const searchParams = createListSearchParams(search);

  return clientApi.getOrThrow<ListSearchResponseDto>(
    `/api/users/me/lists?${searchParams.toString()}`
  );
}
