import z from 'zod';

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

export const offsetPaginationSchema = z.object({
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .catch(DEFAULT_LIMIT)
    .default(DEFAULT_LIMIT),
  page: z.coerce.number().min(1).catch(DEFAULT_PAGE).default(DEFAULT_PAGE),
});

export const cursorPaginationSchema = z.object({
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .catch(DEFAULT_LIMIT)
    .default(DEFAULT_LIMIT),
  cursor: z.string().optional(),
});

export const paginationSchema = cursorPaginationSchema.extend({
  page: z.coerce.number().min(1).optional().catch(undefined),
});
