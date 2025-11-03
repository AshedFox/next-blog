import { FilterableFieldsConfig } from './filter.types';

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  limit: number;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextCursor?: string;
}

export interface EntitySearchConfig<T, R> {
  filterableFields?: FilterableFieldsConfig<T>;
  sortableFields?: (keyof T)[];
  relations?: (keyof R)[];
  searchableFields?: (keyof T)[];
  cursorField?: keyof T;
}
