import { NextRequest, NextResponse } from 'next/server';

import { clientEnv } from '@/lib/env/client';

type Context = {
  params: Promise<{ slug: string[] }>;
};

async function proxyRequest(
  request: NextRequest,
  slug: string[]
): Promise<NextResponse> {
  const backendUrl = new URL(
    `/${slug.join('/')}`,
    clientEnv.NEXT_PUBLIC_BACKEND_URL
  );

  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (
      !['host', 'connection', 'cookie', 'content-length'].includes(
        key.toLowerCase()
      )
    ) {
      headers.set(key, value);
    }
  });

  const clientIp = request.headers.get('x-forwarded-for');

  if (clientIp) {
    headers.set('X-Forwarded-For', clientIp);
  }

  let body: BodyInit | null = null;

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const contentType = request.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const json = await request.json();
        body = JSON.stringify(json);
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.arrayBuffer();
      } else {
        body = await request.text();
      }
    } catch (error) {
      console.error('Error reading request body:', error);
    }
  }

  try {
    const backendResponse = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body,
      // @ts-expect-error - Next.js fetch extension
      duplex: body ? 'half' : undefined,
    });

    const responseHeaders = new Headers();

    backendResponse.headers.forEach((value, key) => {
      if (
        ![
          'set-cookie',
          'content-encoding',
          'transfer-encoding',
          'connection',
        ].includes(key.toLowerCase())
      ) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await backendResponse.arrayBuffer();

    const response = new NextResponse(responseBody, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });

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
