'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { authServerApi } from '../api/server';
import { setAccessToken, setRefreshToken } from '../domain/tokens';
import { SignUpInput } from '../types';

export async function signUp(input: SignUpInput) {
  const { data, error } = await authServerApi.signUp(input);

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
