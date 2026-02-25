import 'server-only';

import { UserDto, UserGetOneDto, UserInclude } from '@workspace/contracts';
import { cacheTag } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessToken } from '@/modules/auth/server';

import { fetchMe, fetchUser } from './server-transport';

export async function getMe() {
  const token = await getAccessToken(await cookies());

  if (!token) {
    return undefined;
  }

  try {
    return await _getMeCached(token);
  } catch {
    return undefined;
  }
}

async function _getMeCached(token: string): Promise<UserDto | undefined> {
  'use cache';
  const { data, error } = await fetchMe(token);

  if (error) {
    throw new Error(`Failed to fetch current user: ${error.message}`);
  }

  if (data) {
    cacheTag(`users-${data.id}`);
  }

  return data;
}

export async function getUser<T extends readonly UserInclude[]>(
  idOrUsername: string,
  query?: Partial<UserGetOneDto> & { include?: T }
) {
  'use cache';
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
