import 'server-only';

import { cookies } from 'next/headers';

import { getAccessToken } from '@/features/auth/server';

import { clientEnv } from '../env/client';
import { ApiFetchResult } from './types';

type FetchOptions = RequestInit & {
  withAuth?: boolean | string;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiFetchResult<T>> {
  try {
    const { withAuth, ...init } = options;

    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');

    if (withAuth) {
      let accessToken: string | undefined;
      if (typeof withAuth === 'string') {
        accessToken = withAuth;
      } else {
        accessToken = await getAccessToken(await cookies());
      }

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
    }

    const res = await fetch(`${clientEnv.NEXT_PUBLIC_BACKEND_URL}${path}`, {
      ...init,
      headers,
    });

    if (!res.ok) {
      const { message } = (await res.json()) as { message: string | string[] };

      return {
        error: {
          status: res.status,
          message: message instanceof Array ? message.join(', ') : message,
        },
      };
    }

    return {
      data: (await res.json()) as T,
    };
  } catch {
    return {
      error: {
        status: 500,
        message: 'Request failed',
      },
    };
  }
}

export async function apiFetchOrThrow<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { data, error } = await apiFetch<T>(path, options);

  if (error) {
    throw error;
  }

  return data;
}

export const serverApi = {
  get<T = unknown>(path: string, withAuth: FetchOptions['withAuth'] = false) {
    return apiFetch<T>(path, { withAuth });
  },
  getOrThrow<T = unknown>(
    path: string,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetchOrThrow<T>(path, { withAuth });
  },
  post<T = unknown, D = unknown>(
    path: string,
    data: D,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetch<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
      withAuth,
    });
  },
  postOrThrow<T = unknown, D = unknown>(
    path: string,
    data: D,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetchOrThrow<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
      withAuth,
    });
  },
  put<T = unknown, D = unknown>(
    path: string,
    data: D,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetch<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
      withAuth,
    });
  },
  putOrThrow<T = unknown, D = unknown>(
    path: string,
    data: D,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetchOrThrow<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
      withAuth,
    });
  },
  patch<T = unknown, D = unknown>(
    path: string,
    data: D,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetch<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
      withAuth,
    });
  },
  patchOrThrow<T = unknown, D = unknown>(
    path: string,
    data: D,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetchOrThrow<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
      withAuth,
    });
  },
  delete<T = unknown>(
    path: string,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetch<T>(path, {
      method: 'DELETE',
      withAuth,
    });
  },
  deleteOrThrow<T = unknown>(
    path: string,
    withAuth: FetchOptions['withAuth'] = false
  ) {
    return apiFetchOrThrow<T>(path, {
      method: 'DELETE',
      withAuth,
    });
  },
};
