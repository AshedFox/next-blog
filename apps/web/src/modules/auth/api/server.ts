import 'server-only';

import { AuthResponseDto, LoginDto, SignUpDto } from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';

export function login(input: LoginDto) {
  return serverApi.post<AuthResponseDto>('/api/auth/login', input);
}

export function signUp(input: SignUpDto) {
  return serverApi.post<AuthResponseDto>('/api/auth/sign-up', input);
}

export function refresh(refreshToken: string) {
  return serverApi.post<AuthResponseDto>('/api/auth/refresh', {
    refreshToken,
  });
}

export function logout(refreshToken: string) {
  return serverApi.post<void>('/api/auth/logout', { refreshToken }, true);
}
