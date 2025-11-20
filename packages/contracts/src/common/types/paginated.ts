import z from 'zod';

import {
  paginatedMetaCursorSchema,
  paginatedMetaOffsetSchema,
  paginatedMetaSchema,
} from '../schemas/paginated-schemas';

export type PaginatedMeta = z.infer<typeof paginatedMetaSchema>;
export type PaginatedMetaCursor = z.infer<typeof paginatedMetaCursorSchema>;
export type PaginatedMetaOffset = z.infer<typeof paginatedMetaOffsetSchema>;

export type PaginatedResponseDto<T> = {
  data: T[];
  meta: PaginatedMeta;
};
