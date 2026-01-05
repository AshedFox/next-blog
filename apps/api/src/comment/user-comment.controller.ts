import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { Public } from '@/auth/decorators/public.decorator';

import { CommentService } from './comment.service';
import { CommentSearchDto } from './dto/comment-search.dto';
import { CommentSearchResponseDto } from './dto/comment-search-response.dto';

@Controller('users')
export class UserCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get(':id/comments')
  @ZodResponse({ type: CommentSearchResponseDto, status: 200 })
  async getUserComments(
    @Param('id') id: string,
    @Query() query: CommentSearchDto
  ) {
    const data = await this.commentService.searchByAuthor(id, query);
    const limit = query.limit;
    const hasNextPage = data.length > limit;

    return {
      data: data.slice(0, limit),
      meta: {
        limit,
        cursor: hasNextPage ? data[data.length - 1]!.id : undefined,
        hasNextPage,
      },
    };
  }
}
