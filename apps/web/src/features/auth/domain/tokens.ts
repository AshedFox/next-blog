import 'server-only';

import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { getServerEnv } from '@/lib/env/server';

export async function setAccessToken(
  cookieStore: Awaited<ReturnType<typeof cookies>> | NextResponse['cookies'],
  token: string,
  expires: Date
) {
  const env = getServerEnv();
  cookieStore.set(env.ACCESS_TOKEN_COOKIE, token, {
    expires,
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function setRefreshToken(
  cookieStore: Awaited<ReturnType<typeof cookies>> | NextResponse['cookies'],
  token: string,
  expires: Date
) {
  const env = getServerEnv();
  cookieStore.set(env.REFRESH_TOKEN_COOKIE, token, {
    expires,
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getAccessToken(
  cookieStore: Awaited<ReturnType<typeof cookies>> | NextRequest['cookies']
) {
  return cookieStore.get(getServerEnv().ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(
  cookieStore: Awaited<ReturnType<typeof cookies>> | NextRequest['cookies']
) {
  return cookieStore.get(getServerEnv().REFRESH_TOKEN_COOKIE)?.value;
}

export async function clearAccessToken(
  cookieStore: Awaited<ReturnType<typeof cookies>> | NextResponse['cookies']
) {
  cookieStore.delete(getServerEnv().ACCESS_TOKEN_COOKIE);
}

export async function clearRefreshToken(
  cookieStore: Awaited<ReturnType<typeof cookies>> | NextResponse['cookies']
) {
  cookieStore.delete(getServerEnv().REFRESH_TOKEN_COOKIE);
}

export function checkAccessToken(token: string): {
  isValid: boolean;
  needsRefresh: boolean;
} {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const now = Date.now();
    const expiryTime = decoded.exp * 1000;
    const timeToExpiry = expiryTime - now;

    return {
      isValid: timeToExpiry > 0,
      needsRefresh:
        timeToExpiry < getServerEnv().TOKEN_REFRESH_THRESHOLD &&
        timeToExpiry > 0,
    };
  } catch {
    return {
      isValid: false,
      needsRefresh: false,
    };
  }
}
