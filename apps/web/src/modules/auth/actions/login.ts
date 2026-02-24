'use server';

import { LoginDto } from '@workspace/contracts';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { setAccessToken, setRefreshToken } from '../domain/tokens';
import { login } from '../server';

export async function loginAction(input: LoginDto) {
  const { data, error } = await login(input);

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
