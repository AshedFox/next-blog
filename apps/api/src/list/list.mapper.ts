import { Injectable } from '@nestjs/common';
import { List, Prisma } from '@prisma/client';
import { ListInDto } from '@workspace/contracts';

import { ListItemMapper, ListItemWithRelations } from './list-item.mapper';

export type ListWithRelations = List & {
  items?: ListItemWithRelations[];
  _count?: Prisma.ListCountOutputType;
};

@Injectable()
export class ListMapper {
  constructor(private readonly listItemMapper: ListItemMapper) {}

  map(list: ListWithRelations): ListInDto {
    const { items, _count, ...rest } = list;

    return {
      ...rest,
      stats: _count,
      items: items ? this.listItemMapper.mapMany(items) : undefined,
    };
  }

  mapMany(lists: ListWithRelations[]): ListInDto[] {
    return lists.map((list) => this.map(list));
  }
}
