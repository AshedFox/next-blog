import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';

import { ListItemDto } from '../dto/list-item.dto';
import { ListItemGetOneDto } from '../dto/list-item-get-one.dto';
import { ListItemSearchDto } from '../dto/list-item-search.dto';
import { ListItemSearchResponseDto } from '../dto/list-item-search-response.dto';
import { ListItemMapper } from '../list-item.mapper';
import { ListItemService } from '../services/list-item.service';

@Controller('lists/:listId/items')
export class ListItemController {
  constructor(
    private readonly listItemService: ListItemService,
    private readonly listItemMapper: ListItemMapper
  ) {}

  @Post(':articleId')
  @ZodResponse({ type: ListItemDto, status: 201 })
  async create(
    @CurrentUser('id') userId: string,
    @Param('listId') listId: string,
    @Param('articleId') articleId: string
  ) {
    const res = await this.listItemService.addToList(userId, listId, articleId);
    return this.listItemMapper.map(res);
  }

  @Get()
  @ZodResponse({ type: ListItemSearchResponseDto, status: 200 })
  async search(
    @CurrentUser('id') userId: string,
    @Param('listId') listId: string,
    @Query() query: ListItemSearchDto
  ) {
    const { page, limit } = query;

    if (!page) {
      const data = await this.listItemService.searchByList(
        userId,
        listId,
        query
      );
      const hasNextPage = data.length > limit;

      return {
        data: this.listItemMapper.mapMany(data),
        meta: {
          limit,
          cursor: hasNextPage ? data[data.length - 1]!.id : undefined,
          hasNextPage,
        },
      };
    }

    const [data, count] = await this.listItemService.searchAndCountByList(
      userId,
      listId,
      query
    );
    const totalPages = Math.ceil(count / limit);

    return {
      data: this.listItemMapper.mapMany(data),
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

  @Get(':articleId')
  @ZodResponse({ type: ListItemDto, status: 200 })
  async getOne(
    @CurrentUser('id') userId: string,
    @Param('listId') listId: string,
    @Param('articleId') articleId: string,
    @Query() query: ListItemGetOneDto
  ) {
    const res = await this.listItemService.getOne(
      userId,
      listId,
      articleId,
      query
    );
    return this.listItemMapper.map(res);
  }

  @Delete(':articleId')
  @ZodResponse({ type: ListItemDto, status: 200 })
  async delete(
    @CurrentUser('id') userId: string,
    @Param('listId') listId: string,
    @Param('articleId') articleId: string
  ) {
    const res = await this.listItemService.delete(userId, listId, articleId);
    return this.listItemMapper.map(res);
  }
}
