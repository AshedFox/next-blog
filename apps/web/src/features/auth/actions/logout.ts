'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { authServerApi } from '../api/server';
import {
  clearAccessToken,
  clearRefreshToken,
  getRefreshToken,
} from '../domain/tokens';

export async function logout() {
  const cookieStore = await cookies();
  const refreshToken = await getRefreshToken(cookieStore);

  if (refreshToken) {
    await authServerApi.logout(refreshToken);
  }

  clearAccessToken(cookieStore);
  clearRefreshToken(cookieStore);

  redirect('/login');
}
