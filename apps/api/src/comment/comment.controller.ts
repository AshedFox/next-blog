import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateCommentDto } from '@workspace/contracts';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { User, UserRole } from '@/prisma/generated/client';

import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CommentGetOneDto } from './dto/comment-get-one.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ZodResponse({ type: CommentDto, status: 201 })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') authorId: string
  ) {
    return this.commentService.create({ ...createCommentDto, authorId });
  }

  @Public()
  @Get(':id')
  @ZodResponse({ type: CommentDto, status: 200 })
  getOne(@Param('id') id: string, @Query() query: CommentGetOneDto) {
    return this.commentService.getOne(id, undefined, query.include);
  }

  @Patch(':id')
  @ZodResponse({ type: CommentDto, status: 200 })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User
  ) {
    const comment = await this.commentService.getOne(id);

    if (comment.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to update this comment'
      );
    }

    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ZodResponse({ type: CommentDto, status: 200 })
  async softDelete(@Param('id') id: string, @CurrentUser() user: User) {
    const comment = await this.commentService.getOne(id);

    if (comment.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment'
      );
    }

    return this.commentService.softDelete(id);
  }

  @Patch(':id/restore')
  @ZodResponse({ type: CommentDto, status: 200 })
  async restore(@Param('id') id: string, @CurrentUser() user: User) {
    const comment = await this.commentService.getOne(id);

    if (comment.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment'
      );
    }

    return this.commentService.restore(id);
  }
}
