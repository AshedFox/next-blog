import z from 'zod';

export const paginatedMetaDefaultSchema = z.object({
  limit: z.number(),
  hasNextPage: z.boolean(),
});

export const paginatedMetaCursorSchema = paginatedMetaDefaultSchema.extend({
  cursor: z.string().optional(),
});

export const paginatedMetaOffsetSchema = paginatedMetaDefaultSchema.extend({
  totalCount: z.number(),
  page: z.number(),
  totalPages: z.number(),
  hasPreviousPage: z.boolean(),
});

export const paginatedMetaSchema = z.union([
  paginatedMetaOffsetSchema,
  paginatedMetaCursorSchema,
]);

export function createPaginatedResponseSchema<T extends z.ZodType>(
  itemSchema: T
) {
  return z.object({
    data: z.array(itemSchema),
    meta: paginatedMetaSchema,
  });
}
