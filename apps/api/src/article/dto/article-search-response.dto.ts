import { Type } from 'class-transformer';

import {
  PaginatedResult,
  PaginationMeta,
} from '@/common/search/types/search.types';

import { ArticleDto } from './article.dto';

export class ArticleSearchResponseDto implements PaginatedResult<ArticleDto> {
  @Type(() => ArticleDto)
  data!: ArticleDto[];

  meta!: PaginationMeta;
}
