import z from 'zod';

import { baseArticleSchema } from '../article';
import {
  createIncludeSchema,
  createPaginatedResponseSchema,
  createSortSchema,
  datetimeOutSchema,
  paginationSchema,
} from '../common';
import { baseListSchema } from '../list/schemas';
import { ListItemInclude } from './enums';
import { ListItemDto } from './types';

export const baseListItemSchema = z.object({
  id: z.uuid(),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  listId: z.uuid(),
  articleId: z.uuid(),
});

export const listItemSchema = baseListItemSchema.extend({
  list: z.lazy(() => baseListSchema).optional(),
  article: z.lazy(() => baseArticleSchema).optional(),
});

export const listItemIncludeSchema = createIncludeSchema(ListItemInclude);

export function createListItemWithRelationsSchema<
  T extends readonly ListItemInclude[],
>(include: T) {
  const overrides = include.reduce(
    (acc, item) => ({
      ...acc,
      [item]: listItemSchema.shape[item].unwrap(),
    }),
    {}
  );

  return listItemSchema.extend(overrides) as unknown as z.ZodType<
    ListItemDto & {
      [K in Extract<T[number], keyof ListItemDto>]-?: NonNullable<
        ListItemDto[K]
      >;
    }
  >;
}

export const listItemSearchSchema = z.object({
  ...paginationSchema.shape,
  sort: createSortSchema(['createdAt']).optional().catch({ createdAt: 'asc' }),
});

export const listItemSearchResponseSchema =
  createPaginatedResponseSchema(listItemSchema);

export const listItemGetOneSchema = z.object({
  include: listItemIncludeSchema.optional(),
});
