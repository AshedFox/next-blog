import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { OptionalAuth } from '@/auth/decorators/optional-auth.decorator';

import { ListInclusionState } from '../dto/list-inclusion-state.dto';
import { ListSearchDto } from '../dto/list-search.dto';
import { ListSearchResponseDto } from '../dto/list-search-response.dto';
import { ListService } from '../services/list.service';

@Controller('users')
export class UserListController {
  constructor(private readonly userListService: ListService) {}

  @Get('/me/lists')
  @ZodResponse({ type: ListSearchResponseDto, status: 200 })
  async searchMy(
    @CurrentUser('id') userId: string,
    @Query() query: ListSearchDto
  ) {
    const { page, limit } = query;

    if (!page) {
      const data = await this.userListService.searchByUser(
        userId,
        query,
        userId
      );
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

    const [data, count] = await this.userListService.searchAndCountByUser(
      userId,
      query,
      userId
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

  @OptionalAuth()
  @Get('/:userId/lists')
  @ZodResponse({ type: ListSearchResponseDto, status: 200 })
  async searchLists(
    @Param('userId') targetUserId: string,
    @Query() query: ListSearchDto,
    @CurrentUser('id') userId?: string
  ) {
    const { page, limit } = query;

    if (!page) {
      const data = await this.userListService.searchByUser(
        targetUserId,
        query,
        userId
      );
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

    const [data, count] = await this.userListService.searchAndCountByUser(
      targetUserId,
      query,
      userId
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

  @Get('me/articles/:articleId/lists/inclusion')
  @ZodResponse({ type: ListInclusionState, status: 200 })
  async getInclusionState(
    @CurrentUser('id') userId: string,
    @Param('articleId') articleId: string
  ) {
    return this.userListService.getInclusionState(userId, articleId);
  }
}
