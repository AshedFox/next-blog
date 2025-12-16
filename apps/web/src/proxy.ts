import { NextRequest, NextResponse } from 'next/server';

import {
  checkAccessToken,
  clearRefreshToken,
  refresh,
  setAccessToken,
  setRefreshToken,
} from './features/auth/server';
import { serverEnv } from './lib/env/server';

const PROTECTED_ROUTE_PREFIXES = ['/profile'];
const GUEST_ONLY_PREFIXES = ['/login', '/sign-up'];

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const accessToken = req.cookies.get(serverEnv.ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(serverEnv.REFRESH_TOKEN_COOKIE)?.value;

  const isProtected = PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isGuestOnly = GUEST_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  const { isValid, needsRefresh } = accessToken
    ? checkAccessToken(accessToken)
    : {};

  if ((!accessToken || !isValid || needsRefresh) && refreshToken) {
    const { data, error } = await refresh(refreshToken);

    const res = error
      ? isProtected
        ? NextResponse.redirect(new URL('/login', req.url))
        : NextResponse.next()
      : isGuestOnly
        ? NextResponse.redirect(new URL('/', req.url))
        : NextResponse.next();

    if (error) {
      clearRefreshToken(res.cookies);
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
    }

    return res;
  }

  if (isGuestOnly && accessToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
