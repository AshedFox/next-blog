import { Controller, Param, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { createZodDto, ZodResponse } from 'nestjs-zod';
import z from 'zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { OptionalAuth } from '@/auth/decorators/optional-auth.decorator';

import { ArticleStatsService } from './article-stats.service';

@Controller('/articles/:id')
export class ArticleStatsController {
  constructor(private readonly articleStatsService: ArticleStatsService) {}

  @OptionalAuth()
  @Post('view')
  @ZodResponse({ type: createZodDto(z.boolean()), status: 200 })
  view(
    @Param('id') articleId: string,
    @Req() req: Request,
    @CurrentUser('id') userId?: string
  ) {
    return this.articleStatsService.trackView(articleId, userId, req.ip);
  }
}
