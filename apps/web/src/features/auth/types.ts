import z from 'zod';

import { User } from '../user/types';
import { loginSchema } from './validation/login-schema';
import { signUpSchema } from './validation/sign-up-schema';

export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

export type AuthResult = {
  accessToken: string;
  accessTokenExpiresAt: string;
  tokenType: 'Bearer';
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: User;
};
