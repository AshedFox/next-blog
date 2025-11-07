import 'server-only';

import { cookies } from 'next/headers';

import { getAccessToken } from '@/features/auth/server';

import { clientEnv } from '../env/client';
import { ApiFetchResult } from './types';

type FetchOptions = RequestInit & {
  requireAuth?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiFetchResult<T>> {
  try {
    const { requireAuth, ...init } = options;

    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');

    if (requireAuth) {
      const accessToken = await getAccessToken(await cookies());

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
        error: new Error(
          message instanceof Array ? message.join(', ') : message
        ),
      };
    }

    return {
      data: (await res.json()) as T,
    };
  } catch {
    return {
      error: new Error('Failed to fetch'),
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
  get<T = unknown>(path: string, requireAuth: boolean = false) {
    return apiFetch<T>(path, { requireAuth });
  },
  getOrThrow<T = unknown>(path: string, requireAuth: boolean = false) {
    return apiFetchOrThrow<T>(path, { requireAuth });
  },
  post<T = unknown, D = unknown>(
    path: string,
    data: D,
    requireAuth: boolean = false
  ) {
    return apiFetch<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth,
    });
  },
  postOrThrow<T = unknown, D = unknown>(
    path: string,
    data: D,
    requireAuth: boolean = false
  ) {
    return apiFetchOrThrow<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth,
    });
  },
  put<T = unknown, D = unknown>(
    path: string,
    data: D,
    requireAuth: boolean = false
  ) {
    return apiFetch<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth,
    });
  },
  putOrThrow<T = unknown, D = unknown>(
    path: string,
    data: D,
    requireAuth: boolean = false
  ) {
    return apiFetchOrThrow<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth,
    });
  },
  patch<T = unknown, D = unknown>(
    path: string,
    data: D,
    requireAuth: boolean = false
  ) {
    return apiFetch<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth,
    });
  },
  patchOrThrow<T = unknown, D = unknown>(
    path: string,
    data: D,
    requireAuth: boolean = false
  ) {
    return apiFetchOrThrow<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
      requireAuth,
    });
  },
  delete<T = unknown>(path: string, requireAuth: boolean = false) {
    return apiFetch<T>(path, {
      method: 'DELETE',
      requireAuth,
    });
  },
  deleteOrThrow<T = unknown>(path: string, requireAuth: boolean = false) {
    return apiFetchOrThrow<T>(path, {
      method: 'DELETE',
      requireAuth,
    });
  },
};
