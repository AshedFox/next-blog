import z from 'zod';

export const paginatedMetaDefaultSchema = z.object({
  limit: z.number().min(1).max(100),
  hasNextPage: z.boolean(),
});

export const paginatedMetaCursorSchema = paginatedMetaDefaultSchema.extend({
  cursor: z.string().optional(),
});

export const paginatedMetaOffsetSchema = paginatedMetaDefaultSchema.extend({
  totalCount: z.number().min(0),
  page: z.number().min(1),
  totalPages: z.number().min(0),
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
