import 'server-only';

import { AuthResponseDto, LoginDto, SignUpDto } from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';

export const authServerApi = {
  login(input: LoginDto) {
    return serverApi.post<AuthResponseDto>('/api/auth/login', input);
  },
  signUp(input: SignUpDto) {
    return serverApi.post<AuthResponseDto>('/api/auth/sign-up', input);
  },
  refresh(refreshToken: string) {
    return serverApi.post<AuthResponseDto>('/api/auth/refresh', {
      refreshToken,
    });
  },
  logout(refreshToken: string) {
    return serverApi.post<void>('/api/auth/logout', { refreshToken }, true);
  },
};
