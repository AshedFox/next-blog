import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';

import { ArticleVoteService } from './article-vote.service';
import { ArticleVoteDto } from './dto/article-vote.dto';
import { ArticleVoteGetManyDto } from './dto/article-vote-get-many.dto';
import { ArticleVoteGetManyResponseDto } from './dto/article-vote-get-many-response.dto';
import { ArticleVotesTotalDto } from './dto/article-votes-total.dto';

@Controller('/articles/:articleId/votes')
export class ArticleVoteController {
  constructor(private readonly articleVoteService: ArticleVoteService) {}

  @ZodResponse({ type: ArticleVoteDto, status: 200 })
  @Post('/upvote')
  upvote(
    @Param('articleId') articleId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.articleVoteService.upvote(articleId, userId);
  }

  @ZodResponse({ type: ArticleVoteDto, status: 200 })
  @Post('/downvote')
  downvote(
    @Param('articleId') articleId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.articleVoteService.downvote(articleId, userId);
  }

  @ZodResponse({ type: ArticleVotesTotalDto, status: 200 })
  @Public()
  @Get('/total')
  async getTotalForArticle(@Param('articleId') articleId: string) {
    return {
      total:
        (await this.articleVoteService.getTotalForArticle(articleId))._sum
          .value ?? 0,
    };
  }

  @ZodResponse({ type: ArticleVoteGetManyResponseDto, status: 200 })
  @Public()
  @Get()
  async getList(
    @Param('articleId') articleId: string,
    @Query() { limit, page, include }: ArticleVoteGetManyDto
  ) {
    const [data, count] =
      await this.articleVoteService.getManyAndCountByArticle(
        articleId,
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

  @ZodResponse({ type: ArticleVoteDto, status: 200 })
  @Delete()
  delete(
    @Param('articleId') articleId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.articleVoteService.delete(articleId, userId);
  }
}
