import { AuthResponseDto } from '@workspace/contracts';
import { NextRequest, NextResponse } from 'next/server';

import { getServerEnv } from '@/lib/env/server';
import {
  checkAccessToken,
  getAccessToken,
  getRefreshToken,
  refresh,
  setAccessToken,
  setRefreshToken,
} from '@/modules/auth/server';

type Context = {
  params: Promise<{ slug: string[] }>;
};

const HOP_BY_HOP_HEADERS = [
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
  'cookie',
  'referer',
];

async function proxyRequest(
  request: NextRequest,
  slug: string[]
): Promise<NextResponse> {
  const accessToken = await getAccessToken(request.cookies);
  const refreshToken = await getRefreshToken(request.cookies);

  let tokenToUse = accessToken;
  let refreshResult: AuthResponseDto | null = null;

  const { isValid, needsRefresh } = accessToken
    ? checkAccessToken(accessToken)
    : {};

  if ((!accessToken || !isValid || needsRefresh) && refreshToken) {
    const { data } = await refresh(refreshToken);

    if (data) {
      refreshResult = data;
      tokenToUse = data.accessToken;
    } else {
      tokenToUse = undefined;
    }
  }

  const backendUrl = new URL(
    `/${slug.join('/')}`,
    getServerEnv().BACKEND_INTERNAL_URL
  );

  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  if (tokenToUse) {
    headers.set('authorization', `Bearer ${tokenToUse}`);
  }

  const clientIp = request.headers.get('x-forwarded-for');

  if (clientIp) {
    headers.set('x-forwarded-for', clientIp);
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: request.body,
      // @ts-expect-error - Next.js streaming body
      duplex: 'half',
    });

    const response = new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });

    response.headers.delete('content-encoding');
    response.headers.delete('content-length');

    if (refreshResult) {
      setAccessToken(
        response.cookies,
        refreshResult.accessToken,
        new Date(refreshResult.accessTokenExpiresAt)
      );
      setRefreshToken(
        response.cookies,
        refreshResult.refreshToken,
        new Date(refreshResult.refreshTokenExpiresAt)
      );
    }

    return response;
  } catch (error) {
    console.error('Backend request failed:', error);
    return NextResponse.json(
      { error: 'Backend service unavailable' },
      { status: 503 }
    );
  }
}

export async function GET(request: NextRequest, { params }: Context) {
  return proxyRequest(request, (await params).slug);
}

export async function POST(request: NextRequest, { params }: Context) {
  return proxyRequest(request, (await params).slug);
}

export async function PUT(request: NextRequest, { params }: Context) {
  return proxyRequest(request, (await params).slug);
}

export async function PATCH(request: NextRequest, { params }: Context) {
  return proxyRequest(request, (await params).slug);
}

export async function DELETE(request: NextRequest, { params }: Context) {
  return proxyRequest(request, (await params).slug);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
