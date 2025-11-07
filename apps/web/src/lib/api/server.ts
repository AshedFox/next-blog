import 'server-only';

import { clientEnv } from '../env/client';
import { ApiFetchResult } from './types';

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiFetchResult<T>> {
  try {
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');

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
  init: RequestInit = {}
): Promise<T> {
  const { data, error } = await apiFetch<T>(path, init);

  if (error) {
    throw error;
  }

  return data;
}

export const serverApi = {
  get<T = unknown>(path: string) {
    return apiFetch<T>(path);
  },
  getOrThrow<T = unknown>(path: string) {
    return apiFetchOrThrow<T>(path);
  },
  post<T = unknown, D = unknown>(path: string, data: D) {
    return apiFetch<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  postOrThrow<T = unknown, D = unknown>(path: string, data: D) {
    return apiFetchOrThrow<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  put<T = unknown, D = unknown>(path: string, data: D) {
    return apiFetch<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  putOrThrow<T = unknown, D = unknown>(path: string, data: D) {
    return apiFetchOrThrow<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  patch<T = unknown, D = unknown>(path: string, data: D) {
    return apiFetch<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  patchOrThrow<T = unknown, D = unknown>(path: string, data: D) {
    return apiFetchOrThrow<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  delete<T = unknown>(path: string) {
    return apiFetch<T>(path, {
      method: 'DELETE',
    });
  },
  deleteOrThrow<T = unknown>(path: string) {
    return apiFetchOrThrow<T>(path, {
      method: 'DELETE',
    });
  },
};
