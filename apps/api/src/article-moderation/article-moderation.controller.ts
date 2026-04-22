import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { ArticleModerationMapper } from './article-moderation.mapper';
import { ArticleModerationService } from './article-moderation.service';
import { ArticleModerationGetManyDto } from './dto/article-moderation-get-many.dto';
import { ArticleModerationGetManyResponseDto } from './dto/article-moderation-get-many-response.dto';

@Controller('articles/:articleId/moderation-logs')
export class ArticleModerationController {
  constructor(
    private readonly articleModerationService: ArticleModerationService,
    private readonly mapper: ArticleModerationMapper
  ) {}

  @ZodResponse({ type: ArticleModerationGetManyResponseDto, status: 200 })
  @Get()
  async getMany(
    @Param('articleId') articleId: string,
    @Query() { include, limit, page }: ArticleModerationGetManyDto
  ) {
    const [data, count] =
      await this.articleModerationService.findManyAndCountByArticle(
        articleId,
        limit,
        limit * (page - 1),
        include
      );
    const totalPages = Math.ceil(count / limit);

    return {
      data: this.mapper.mapMany(data),
      meta: {
        limit,
        totalCount: count,
        totalPages,
        page,
        hasNextPage: count > page * limit,
        hasPreviousPage: page > 1 && page - 1 <= totalPages,
      },
    };
  }
}
