'use server';

import { LoginDto } from '@workspace/contracts';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { authServerApi } from '../api/server';
import { setAccessToken, setRefreshToken } from '../domain/tokens';

export async function login(input: LoginDto) {
  const { data, error } = await authServerApi.login(input);

  if (error) {
    return { message: error.message };
  }

  const cookieStore = await cookies();
  setAccessToken(
    cookieStore,
    data.accessToken,
    new Date(data.accessTokenExpiresAt)
  );
  setRefreshToken(
    cookieStore,
    data.refreshToken,
    new Date(data.refreshTokenExpiresAt)
  );

  redirect('/');
}
