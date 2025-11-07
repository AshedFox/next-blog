import 'server-only';

import { serverApi } from '@/lib/api/server';

import { AuthResult, LoginInput, SignUpInput } from '../types';

export const authServerApi = {
  login(input: LoginInput) {
    return serverApi.post<AuthResult>('/api/auth/login', input);
  },
  signUp(input: SignUpInput) {
    return serverApi.post<AuthResult>('/api/auth/sign-up', input);
  },
  refresh(refreshToken: string) {
    return serverApi.post<AuthResult>('/api/auth/refresh', { refreshToken });
  },
  logout(refreshToken: string) {
    return serverApi.post<void>('/api/auth/logout', { refreshToken }, true);
  },
};
