import { Controller, Delete, Param, Post } from '@nestjs/common';
import { SystemListType } from '@workspace/contracts';
import { ZodResponse } from 'nestjs-zod';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';

import { ListItemDto } from '../dto/list-item.dto';
import { ListItemMapper } from '../list-item.mapper';
import { ListItemService } from '../services/list-item.service';

const paramsSchema = z.object({
  type: z.enum(SystemListType),
  articleId: z.uuid(),
});

class ParamsDto extends createZodDto(paramsSchema) {}

@Controller('lists/system/:type/items/:articleId')
export class SystemListItemController {
  constructor(
    private readonly listItemService: ListItemService,
    private readonly listItemMapper: ListItemMapper
  ) {}

  @Post()
  @ZodResponse({ type: ListItemDto, status: 201 })
  async create(
    @CurrentUser('id') userId: string,
    @Param() { type, articleId }: ParamsDto
  ) {
    const list = await this.listItemService.addToSystemList(
      userId,
      articleId,
      type
    );
    return this.listItemMapper.map(list);
  }

  @Delete()
  @ZodResponse({ type: ListItemDto, status: 200 })
  async delete(
    @CurrentUser('id') userId: string,
    @Param() { type, articleId }: ParamsDto
  ) {
    const list = await this.listItemService.deleteFromSystemList(
      userId,
      articleId,
      type
    );
    return this.listItemMapper.map(list);
  }
}
