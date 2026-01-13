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

import { CreateListDto } from '../dto/create-list.dto';
import { ListDto } from '../dto/list.dto';
import { ListGetOneDto } from '../dto/list-get-one.dto';
import { UpdateListDto } from '../dto/update-list.dto';
import { ListService } from '../services/list.service';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ZodResponse({ type: ListDto, status: 201 })
  create(@Body() input: CreateListDto, @CurrentUser('id') userId: string) {
    return this.listService.create({ ...input, userId });
  }

  @Get(':id')
  @ZodResponse({ type: ListDto, status: 200 })
  getOne(@Param('id') id: string, @Query() query: ListGetOneDto) {
    return this.listService.getOne(id, query);
  }

  @Patch(':id')
  @ZodResponse({ type: ListDto, status: 200 })
  update(@Param('id') id: string, @Body() input: UpdateListDto) {
    return this.listService.update(id, input);
  }

  @Delete(':id')
  @ZodResponse({ type: ListDto, status: 200 })
  delete(@Param('id') id: string) {
    return this.listService.delete(id);
  }
}
