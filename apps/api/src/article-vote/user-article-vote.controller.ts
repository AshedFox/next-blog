import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArticleVoteGetManyDto } from '@workspace/contracts';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';

import { ArticleVoteService } from './article-vote.service';
import { ArticleVoteDto } from './dto/article-vote.dto';
import { ArticleVoteGetManyResponseDto } from './dto/article-vote-get-many-response.dto';

@Controller('users')
export class UserArticleVoteController {
  constructor(private readonly articleVoteService: ArticleVoteService) {}

  @ZodResponse({ type: ArticleVoteDto, status: 200 })
  @Get('me/articles/:articleId/votes')
  getVote(
    @Param('articleId') articleId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.articleVoteService.getOne(articleId, userId);
  }

  @ZodResponse({ type: ArticleVoteGetManyResponseDto, status: 200 })
  @Get('me/articles/votes')
  async getVotes(
    @CurrentUser('id') userId: string,
    @Query() { limit, page, include }: ArticleVoteGetManyDto
  ) {
    const [data, count] = await this.articleVoteService.getManyAndCountByUser(
      userId,
      limit,
      (page - 1) * limit,
      include
    );
    const totalPages = Math.ceil(count / limit);

    return {
      data,
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
