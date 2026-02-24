'use server';

import { SignUpDto } from '@workspace/contracts';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { setAccessToken, setRefreshToken } from '../domain/tokens';
import { signUp } from '../server';

export async function signUpAction(input: SignUpDto) {
  const { data, error } = await signUp(input);

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
