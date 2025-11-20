import z from 'zod';

import { baseArticleSchema } from '../article';
import { createIncludeSchema, datetimeOutSchema } from '../common';
import { UserRole, UserStatus } from './enums';
import { UserInclude } from './enums';
import { UserDto } from './types';

export const createUserSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .min(8)
    .regex(/[a-zA-Z]/, {
      error: 'Password must contain at least one letter.',
    })
    .regex(/[0-9]/, { error: 'Password must contain at least one number.' })
    .trim(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(120).optional(),
});

export const baseUserSchema = z.object({
  id: z.uuid(),
  email: z.email().trim(),
  username: z.string().min(2).max(60),
  name: z.string().min(2).max(120),
  role: z.enum(UserRole),
  status: z.enum(UserStatus),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
});

export const userSchema = baseUserSchema.extend({
  articles: z.lazy(() => z.array(baseArticleSchema)).optional(),
});

export const userIncludeSchema = createIncludeSchema(UserInclude);

export function createUserWithRelationsSchema<T extends readonly UserInclude[]>(
  include: T
): z.ZodType<
  UserDto & {
    [K in Extract<T[number], keyof UserDto>]-?: NonNullable<UserDto[K]>;
  }
> {
  const includeSet = new Set(include);

  return userSchema.extend({
    author: includeSet.has('articles')
      ? userSchema.shape.articles.unwrap()
      : userSchema.shape.articles,
  }) as unknown as z.ZodType<
    UserDto & {
      [K in Extract<T[number], keyof UserDto>]-?: NonNullable<UserDto[K]>;
    }
  >;
}
