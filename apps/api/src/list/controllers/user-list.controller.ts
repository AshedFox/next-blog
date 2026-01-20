import { Controller, Get, Param, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';

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
    const [data, count] = await this.userListService.searchAndCountByUser(
      userId,
      query
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
