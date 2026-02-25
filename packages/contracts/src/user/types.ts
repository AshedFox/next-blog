import z from 'zod';

import { UserInclude } from './enums';
import {
  baseUserSchema,
  createUserSchema,
  createUserWithRelationsSchema,
  updateUserSchema,
  userGetOneSchema,
  userSchema,
} from './schemas';

export type CreateUserDto = z.infer<typeof createUserSchema>;

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export type BaseUserDto = z.infer<typeof baseUserSchema>;

export type UserDto = z.infer<typeof userSchema>;

export type UserInDto = z.input<typeof userSchema>;

export type UserWithRelationsDto<T extends readonly UserInclude[]> = z.infer<
  ReturnType<typeof createUserWithRelationsSchema<T>>
>;

export type UserGetOneDto = z.infer<typeof userGetOneSchema>;
