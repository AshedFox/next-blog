import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { Public } from '@/auth/decorators/public.decorator';

import { CommentMapper } from './comment.mapper';
import { CommentService } from './comment.service';
import { CommentSearchDto } from './dto/comment-search.dto';
import { CommentSearchResponseDto } from './dto/comment-search-response.dto';

@Controller('articles')
export class ArticleCommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentMapper: CommentMapper
  ) {}

  @Public()
  @Get(':id/comments')
  @ZodResponse({ type: CommentSearchResponseDto, status: 200 })
  async getArticleComments(
    @Param('id') id: string,
    @Query() query: CommentSearchDto
  ) {
    const data = await this.commentService.searchByArticle(id, query);
    const limit = query.limit;
    const hasNextPage = data.length > limit;

    return {
      data: this.commentMapper.mapMany(data.slice(0, limit)),
      meta: {
        limit,
        cursor: hasNextPage ? data[data.length - 1]!.id : undefined,
        hasNextPage,
      },
    };
  }
}
