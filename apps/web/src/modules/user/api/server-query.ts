import 'server-only';

import { UserDto } from '@workspace/contracts';
import { cacheTag } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessToken } from '@/modules/auth/server';

import { fetchMe } from './server-transport';

export async function getMe() {
  const token = await getAccessToken(await cookies());
  return token ? _getMeCached(token) : undefined;
}

async function _getMeCached(token: string): Promise<UserDto | undefined> {
  'use cache';
  const { data } = await fetchMe(token);

  if (data) {
    cacheTag(`users-${data.id}`);
  }

  return data;
}
