import z from 'zod';

import {
  cursorPaginationSchema,
  offsetPaginationSchema,
  paginationSchema,
} from '../schemas/pagination-schemas';

export type OffsetPagination = z.infer<typeof offsetPaginationSchema>;

export type CursorPagination = z.infer<typeof cursorPaginationSchema>;

export type Pagination = z.infer<typeof paginationSchema>;
