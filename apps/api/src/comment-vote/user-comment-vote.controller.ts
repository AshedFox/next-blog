import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';

import { CommentVoteService } from './comment-vote.service';
import { CommentVoteDto } from './dto/comment-vote.dto';
import { CommentVoteGetManyDto } from './dto/comment-vote-get-many.dto';
import { CommentVoteGetManyResponseDto } from './dto/comment-vote-get-many-response.dto';

@Controller('users')
export class UserCommentVoteController {
  constructor(private readonly commentVoteService: CommentVoteService) {}

  @ZodResponse({ type: CommentVoteDto, status: 200 })
  @Get('me/comments/:commentId/votes')
  getVote(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.commentVoteService.getOne(commentId, userId);
  }

  @ZodResponse({ type: CommentVoteGetManyResponseDto, status: 200 })
  @Get('me/comments/votes')
  async getVotes(
    @CurrentUser('id') userId: string,
    @Query() query: CommentVoteGetManyDto
  ) {
    const [data, count] = await this.commentVoteService.getManyAndCountByUser(
      userId,
      query
    );

    const { page, limit } = query;
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
