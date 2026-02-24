import z from 'zod';

import { baseArticleSchema } from '../article';
import { baseCommentSchema } from '../comment';
import { createIncludeSchema, datetimeOutSchema } from '../common';
import { baseListSchema } from '../list';
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
  username: z.string(),
  name: z.string(),
  role: z.enum(UserRole),
  status: z.enum(UserStatus),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
});

export const userSchema = baseUserSchema.extend({
  articles: z.lazy(() => z.array(baseArticleSchema)).optional(),
  comments: z.lazy(() => z.array(baseCommentSchema)).optional(),
  lists: z.lazy(() => z.array(baseListSchema)).optional(),
  stats: z
    .object({
      articles: z.number().optional(),
      comments: z.number().optional(),
      lists: z.number().optional(),
    })
    .optional(),
});

export const userIncludeSchema = createIncludeSchema(UserInclude);

export function createUserWithRelationsSchema<T extends readonly UserInclude[]>(
  include: T
) {
  const overrides = include.reduce((acc, item) => {
    if (
      item === 'articlesCount' ||
      item === 'commentsCount' ||
      item === 'listsCount'
    ) {
      return {
        ...acc,
        stats: acc.stats
          ? { ...acc.stats, [item]: z.number() }
          : userSchema.shape['stats'].unwrap().extend({
              items: z.number(),
            }),
      };
    }
    return { ...acc, [item]: userSchema.shape[item].unwrap() };
  }, {} as z.core.$ZodLooseShape);

  return userSchema.extend(overrides) as unknown as z.ZodType<
    UserDto & {
      [K in Extract<T[number], keyof UserDto>]-?: NonNullable<UserDto[K]>;
    }
  >;
}

export const userGetOneSchema = z.object({
  include: userIncludeSchema.optional(),
  articlesLimit: z.coerce.number().min(1).max(100).default(10).catch(10),
  commentsLimit: z.coerce.number().min(1).max(100).default(10).catch(10),
  listsLimit: z.coerce.number().min(1).max(100).default(20).catch(20),
});
