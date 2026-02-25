import 'server-only';

import {
  UserDto,
  UserGetOneDto,
  userGetOneSchema,
  UserInclude,
  UserWithRelationsDto,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';
import { createApiSearchParams } from '@/lib/search-params';

export function fetchMe(token?: string) {
  return serverApi.get<UserDto>(`/api/users/me`, token);
}

export function fetchUser(
  idOrUsername: string,
  query?: Partial<UserGetOneDto>
) {
  const search = userGetOneSchema.parse(query || {});
  const searchParams = createApiSearchParams(search);

  return serverApi.get<UserWithRelationsDto<UserInclude[]>>(
    `/api/users/${idOrUsername}?${searchParams.toString()}`
  );
}
