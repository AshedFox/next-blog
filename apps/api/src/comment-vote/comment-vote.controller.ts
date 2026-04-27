import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';

import { CommentVoteService } from './comment-vote.service';
import { CommentVoteDto } from './dto/comment-vote.dto';
import { CommentVoteGetManyDto } from './dto/comment-vote-get-many.dto';
import { CommentVoteGetManyResponseDto } from './dto/comment-vote-get-many-response.dto';
import { CommentVotesTotalDto } from './dto/comment-votes-total.dto';
import { CommentsVotesTotalsDto } from './dto/comments-votes-totals.dto';
import { CommentsVotesTotalsArgsDto } from './dto/comments-votes-totals-args.dto';

@Controller('/comments')
export class CommentVoteController {
  constructor(private readonly commentVoteService: CommentVoteService) {}

  @ZodResponse({ type: CommentVoteDto, status: 200 })
  @Post('/:commentId/votes/upvote')
  upvote(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.commentVoteService.upvote(commentId, userId);
  }

  @ZodResponse({ type: CommentVoteDto, status: 200 })
  @Post('/:commentId/votes/downvote')
  downvote(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.commentVoteService.downvote(commentId, userId);
  }

  @ZodResponse({ type: CommentVotesTotalDto, status: 200 })
  @Public()
  @Get('/:commentId/votes/total')
  async getTotalForComment(@Param('commentId') commentId: string) {
    return {
      total: await this.commentVoteService.getTotalForComment(commentId),
    };
  }

  @ZodResponse({ type: CommentsVotesTotalsDto, status: 200 })
  @Public()
  @Get('/votes/total')
  async getTotalsForComments(
    @Query() { commentsIds }: CommentsVotesTotalsArgsDto
  ) {
    return this.commentVoteService.getTotalsForComments(commentsIds);
  }

  @ZodResponse({ type: CommentVoteGetManyResponseDto, status: 200 })
  @Public()
  @Get('/:commentId/votes')
  async getList(
    @Param('commentId') commentId: string,
    @Query() query: CommentVoteGetManyDto
  ) {
    const [data, count] =
      await this.commentVoteService.getManyAndCountByComment(commentId, query);
    const { limit, page } = query;
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

  @ZodResponse({ type: CommentVoteDto, status: 200 })
  @Delete('/:commentId/votes')
  delete(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.commentVoteService.delete(commentId, userId);
  }
}
