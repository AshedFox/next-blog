import { Controller, Get, Query } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { Public } from '@/auth/decorators/public.decorator';

import { TagDto } from './dto/tag.dto';
import { TagSearchDto } from './dto/tag-search.dto';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get()
  @ZodResponse({ type: [TagDto] })
  async search(@Query() query: TagSearchDto) {
    return this.tagService.search(query);
  }
}
