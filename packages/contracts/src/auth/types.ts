import z from 'zod';

import { authResponseSchema, loginSchema, signUpSchema } from './schemas';

export type LoginDto = z.infer<typeof loginSchema>;

export type SignUpDto = z.infer<typeof signUpSchema>;

export type AuthResponseDto = z.infer<typeof authResponseSchema>;

export type AuthResponseInDto = z.input<typeof authResponseSchema>;
