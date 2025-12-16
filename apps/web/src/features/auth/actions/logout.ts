'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  clearAccessToken,
  clearRefreshToken,
  getRefreshToken,
} from '../domain/tokens';
import { logout } from '../server';

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = await getRefreshToken(cookieStore);

  if (refreshToken) {
    await logout(refreshToken);
  }

  clearAccessToken(cookieStore);
  clearRefreshToken(cookieStore);

  redirect('/login');
}
