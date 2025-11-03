import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

import { TransformFilters } from '../transformers/filter.transformer';
import { TransformInclude } from '../transformers/include.transformer';
import { TransformSort } from '../transformers/sort.transformer';
import { ParsedFilters } from '../types/filter.types';
import {
  CursorPagination,
  OffsetPagination,
  Pagination,
  PaginationType,
} from '../types/pagination.types';
import { SortField } from '../types/sort.types';

export abstract class BaseSearchDto<T, R> {
  @TransformFilters<T>()
  filters: ParsedFilters<T> = {};

  @IsOptional()
  @IsString()
  @TransformSort<T>()
  sort: SortField<T>[] = [];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  @TransformInclude<R>()
  include: (keyof R)[] = [];

  @IsOptional()
  @IsString()
  search?: string;

  getPagination(): Pagination {
    if (this.page !== undefined) {
      return {
        type: PaginationType.OFFSET,
        limit: this.limit,
        page: this.page ?? 1,
      } as OffsetPagination;
    }

    return {
      type: PaginationType.CURSOR,
      limit: this.limit,
      cursor: this.cursor,
    } as CursorPagination;
  }
}
