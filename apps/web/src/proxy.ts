import { NextRequest, NextResponse } from 'next/server';

import {
  checkAccessToken,
  clearRefreshToken,
  refresh,
  setAccessToken,
  setRefreshToken,
} from './features/auth/server';
import { getServerEnv } from './lib/env/server';

const PROTECTED_PATTERNS = [
  /^\/profile/,
  /^\/articles\/new$/,
  /^\/articles\/[^/]+\/edit$/,
];

const GUEST_ONLY_PATTERNS = [/^\/login$/, /^\/sign-up$/];

const isMatch = (path: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(path));

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const env = getServerEnv();
  const accessToken = req.cookies.get(env.ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(env.REFRESH_TOKEN_COOKIE)?.value;

  const isProtected = isMatch(pathname, PROTECTED_PATTERNS);
  const isGuestOnly = isMatch(pathname, GUEST_ONLY_PATTERNS);

  const { isValid, needsRefresh } = accessToken
    ? checkAccessToken(accessToken)
    : {};

  let isAuthorized = isValid;
  let res = NextResponse.next();

  if ((!isValid || needsRefresh) && refreshToken) {
    const { data, error } = await refresh(refreshToken);

    if (error) {
      if (isProtected) {
        res = NextResponse.redirect(new URL('/login', req.url));
      }
      clearRefreshToken(res.cookies);
      isAuthorized = false;
    } else {
      setAccessToken(
        res.cookies,
        data.accessToken,
        new Date(data.accessTokenExpiresAt)
      );
      setRefreshToken(
        res.cookies,
        data.refreshToken,
        new Date(data.refreshTokenExpiresAt)
      );
      isAuthorized = true;
    }
  }

  if (isGuestOnly && isAuthorized) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isProtected && !isAuthorized) {
    if (res.status === 307 || res.status === 302) {
      return res;
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
