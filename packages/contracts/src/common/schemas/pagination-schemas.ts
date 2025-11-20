import z from 'zod';

export const offsetPaginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(1),
});

export const cursorPaginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100),
  cursor: z.string().optional(),
});

export const paginationSchema = cursorPaginationSchema.extend({
  page: offsetPaginationSchema.shape.page.optional(),
});
