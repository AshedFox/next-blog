import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { OptionalAuth } from '@/auth/decorators/optional-auth.decorator';

import { CreateListDto } from '../dto/create-list.dto';
import { ListDto } from '../dto/list.dto';
import { ListGetOneDto } from '../dto/list-get-one.dto';
import { UpdateListDto } from '../dto/update-list.dto';
import { ListMapper } from '../list.mapper';
import { ListService } from '../services/list.service';

@Controller('lists')
export class ListController {
  constructor(
    private readonly listService: ListService,
    private readonly listMapper: ListMapper
  ) {}

  @Post()
  @ZodResponse({ type: ListDto, status: 201 })
  async create(
    @Body() input: CreateListDto,
    @CurrentUser('id') userId: string
  ) {
    const list = await this.listService.create({ ...input, userId });
    return this.listMapper.map(list);
  }

  @OptionalAuth()
  @Get(':id')
  @ZodResponse({ type: ListDto, status: 200 })
  async getOne(
    @Param('id') id: string,
    @Query() query: ListGetOneDto,
    @CurrentUser('id') userId?: string
  ) {
    const list = await this.listService.getOne(id, query, userId);
    return this.listMapper.map(list);
  }

  @Patch(':id')
  @ZodResponse({ type: ListDto, status: 200 })
  async update(
    @Param('id') id: string,
    @Body() input: UpdateListDto,
    @CurrentUser('id') userId: string
  ) {
    const list = await this.listService.update(id, input, userId);
    return this.listMapper.map(list);
  }

  @Delete(':id')
  @ZodResponse({ type: ListDto, status: 200 })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const list = await this.listService.delete(id, userId);
    return this.listMapper.map(list);
  }
}
