'use client';

import { ApiFetchResult } from './types';

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiFetchResult<T>> {
  try {
    const url = `/api${path.startsWith('/') ? path : `/${path}`}`;

    const response = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Request failed' }));

      return {
        error: {
          status: response.status,
          message:
            error.message && typeof error.message === 'string'
              ? error.message instanceof Array
                ? error.message.join(', ')
                : error.message
              : `HTTP ${response.status}`,
        },
      };
    }

    return {
      data: (await response.json()) as T,
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
  init: RequestInit = {}
): Promise<T> {
  const { data, error } = await apiFetch<T>(path, init);

  if (error) {
    throw error;
  }

  return data;
}

export const clientApi = {
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
