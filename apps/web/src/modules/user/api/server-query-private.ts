'use cache: private';

import { UserDto } from '@workspace/contracts';
import { cacheTag } from 'next/cache';
import { cookies } from 'next/headers';

import { getAccessToken } from '@/modules/auth/server';

import { fetchMe } from './server-transport';

export async function getMe(): Promise<UserDto | undefined> {
  const token = await getAccessToken(await cookies());

  if (!token) {
    return undefined;
  }

  try {
    const { data, error } = await fetchMe(token);

    if (error) {
      throw new Error(`Failed to fetch current user: ${error.message}`);
    }

    if (data) {
      cacheTag(`users-${data.id}`);
    }

    return data;
  } catch {
    return undefined;
  }
}
