import z from 'zod';

import { createUserSchema, updateUserSchema, userSchema } from './schemas';

export type CreateUserDto = z.infer<typeof createUserSchema>;

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export type UserDto = z.infer<typeof userSchema>;

export type UserInDto = z.input<typeof userSchema>;
