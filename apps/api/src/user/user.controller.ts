import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { MinRole } from '@/auth/decorators/min-role.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { CommentService } from '@/comment/comment.service';
import { CommentSearchDto } from '@/comment/dto/comment-search.dto';
import { CommentSearchResponseDto } from '@/comment/dto/comment-search-response.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserGetOneDto } from './dto/user-get-one.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService
  ) {}

  @Get('me')
  @ZodResponse({ type: UserDto })
  getMe(@CurrentUser('id') userId: string, @Query() query: UserGetOneDto) {
    return this.userService.getOneById(userId, undefined, query.include);
  }

  @Patch('me')
  @ZodResponse({ type: UserDto })
  patchMe(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Post('me/recover')
  @ZodResponse({ type: UserDto, status: 200 })
  recoverMe(@CurrentUser('id') userId: string) {
    return this.userService.restore(userId);
  }

  @Delete('me')
  @ZodResponse({ type: UserDto })
  deleteMe(@CurrentUser('id') userId: string) {
    return this.userService.softDelete(userId);
  }

  @Get(':id')
  @ZodResponse({ type: UserDto })
  getOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: UserGetOneDto
  ) {
    return this.userService.getOneById(id, undefined, query.include);
  }

  @MinRole(UserRole.ADMIN)
  @Patch(':id')
  @ZodResponse({ type: UserDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @MinRole(UserRole.ADMIN)
  @Post(':id/restore')
  @ZodResponse({ type: UserDto, status: 200 })
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.restore(id);
  }

  @MinRole(UserRole.ADMIN)
  @Delete(':id')
  @ZodResponse({ type: UserDto })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.softDelete(id);
  }

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
