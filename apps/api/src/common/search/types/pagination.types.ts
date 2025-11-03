export const PaginationType = {
  OFFSET: 'offset',
  CURSOR: 'cursor',
} as const;

export type PaginationType =
  (typeof PaginationType)[keyof typeof PaginationType];

export interface OffsetPagination {
  type: typeof PaginationType.OFFSET;
  limit: number;
  page: number;
}

export interface CursorPagination {
  type: typeof PaginationType.CURSOR;
  limit: number;
  cursor?: string;
}

export type Pagination = OffsetPagination | CursorPagination;
