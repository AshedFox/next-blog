'use cache';

import { UserGetOneDto, UserInclude } from '@workspace/contracts';
import { cacheTag } from 'next/cache';

import { fetchUser } from './server-transport';

export async function getUser<T extends readonly UserInclude[]>(
  idOrUsername: string,
  query?: Partial<UserGetOneDto> & { include?: T }
) {
  const { data, error } = await fetchUser(idOrUsername, query);

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  if (data) {
    cacheTag(`users-${data.id}`);
    cacheTag(`users-${data.username}`);
  }

  return data;
}
