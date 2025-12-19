import 'server-only';

import { UserDto } from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';

export function fetchMe(token?: string) {
  return serverApi.get<UserDto>(`/api/users/me`, token);
}
