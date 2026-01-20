import z from 'zod';

import {
  createArrayFilterSchema,
  createIncludeSchema,
  createPaginatedResponseSchema,
  createSortSchema,
  datetimeOutSchema,
  paginationSchema,
} from '../common';
import { baseListItemSchema } from '../list-item';
import { baseUserSchema } from '../user/schemas';
import { ListInclude, SystemListType } from './enums';
import { ListDto } from './types';

export const createListSchema = z.object({
  name: z.string().min(1).max(120),
});

export const updateListSchema = z.object({
  name: z.string().min(1).max(120).optional(),
});

export const baseListSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  systemType: z.enum(SystemListType).nullable(),
  isPublic: z.boolean(),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  userId: z.uuid(),
});

export const listSchema = baseListSchema.extend({
  user: z.lazy(() => baseUserSchema).optional(),
  items: z.lazy(() => z.array(baseListItemSchema)).optional(),
  stats: z.object({ items: z.number().optional() }).optional(),
});

export const listIncludeSchema = createIncludeSchema(ListInclude);

export function createListWithRelationsSchema<T extends readonly ListInclude[]>(
  include: T
) {
  const overrides = include.reduce((acc, item) => {
    if (item === 'itemsCount') {
      return {
        ...acc,
        stats: listSchema.shape['stats'].unwrap().extend({
          items: z.number(),
        }),
      };
    }
    return {
      ...acc,
      [item]: listSchema.shape[item].unwrap(),
    };
  }, {});

  return listSchema.extend(overrides) as unknown as z.ZodType<
    ListDto & {
      [K in Extract<T[number], keyof ListDto>]-?: NonNullable<ListDto[K]>;
    }
  >;
}

export const listSearchSchema = z.object({
  ...paginationSchema.shape,
  search: z.string().min(1).max(120).optional(),
  sort: createSortSchema(['name', 'createdAt'])
    .optional()
    .catch({ name: 'asc' }),
  include: listIncludeSchema.optional(),
  itemsLimit: z.coerce.number().min(1).max(100).default(10).catch(10),
  systemType: createArrayFilterSchema(
    z.array(z.enum(SystemListType)).nullable()
  )
    .optional()
    .catch(undefined),
  excludeArticlesIds: createArrayFilterSchema(z.array(z.uuid()))
    .optional()
    .catch(undefined),
});

export const listSearchResponseSchema =
  createPaginatedResponseSchema(listSchema);

export const listGetOneSchema = z.object({
  include: listIncludeSchema.optional(),
  itemsLimit: z.coerce.number().min(1).max(100).default(10).catch(10),
});

export const listInclusionStateSchema = z.object({
  isFavorite: z.boolean(),
  isReadLater: z.boolean(),
  customListsIds: z.array(z.uuid()),
});
