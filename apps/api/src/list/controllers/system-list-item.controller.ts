import { Controller, Delete, Param, Post } from '@nestjs/common';
import { SystemListType } from '@workspace/contracts';
import { ZodResponse } from 'nestjs-zod';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';

import { ListItemDto } from '../dto/list-item.dto';
import { ListItemService } from '../services/list-item.service';

const paramsSchema = z.object({
  type: z.enum(SystemListType),
  articleId: z.uuid(),
});

class ParamsDto extends createZodDto(paramsSchema) {}

@Controller('lists/system/:type/items/:articleId')
export class SystemListItemController {
  constructor(private readonly listItemService: ListItemService) {}

  @Post()
  @ZodResponse({ type: ListItemDto, status: 201 })
  create(
    @CurrentUser('id') userId: string,
    @Param() { type, articleId }: ParamsDto
  ) {
    return this.listItemService.addToSystemList(userId, articleId, type);
  }

  @Delete()
  @ZodResponse({ type: ListItemDto, status: 200 })
  delete(
    @CurrentUser('id') userId: string,
    @Param() { type, articleId }: ParamsDto
  ) {
    return this.listItemService.deleteFromSystemList(userId, articleId, type);
  }
}
