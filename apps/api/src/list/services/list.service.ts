import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ListGetOneDto,
  ListInclude,
  ListInclusionStateDto,
  ListSearchDto,
  UpdateListDto,
} from '@workspace/contracts';

import { List, Prisma } from '@/prisma/generated/client';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateListInput } from '../list.types';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  private mapInclude(
    include: ListInclude[],
    itemsLimit: number
  ): Prisma.ListInclude {
    return {
      _count: { select: { items: include?.includes('itemsCount') } },
      items: include?.includes('items') && { take: itemsLimit },
      user: include?.includes('user') && true,
    };
  }

  private mapStats(
    list: List & { _count?: { items?: number } }
  ): List & { stats?: { items?: number } } {
    return {
      ...list,
      stats: list._count,
    };
  }

  create(input: CreateListInput): Promise<List> {
    return this.prisma.list.create({
      data: {
        ...input,
        systemType: null,
      },
    });
  }

  async findOne(
    id: string,
    { include, itemsLimit }: ListGetOneDto
  ): Promise<List | null> {
    const list = await this.prisma.list.findUnique({
      where: { id },
      include: include && this.mapInclude(include, itemsLimit),
    });
    return list ? this.mapStats(list) : null;
  }

  async getOne(id: string, query: ListGetOneDto): Promise<List> {
    const list = await this.findOne(id, query);
    if (!list) {
      throw new NotFoundException('List not found');
    }
    return list;
  }

  async searchByUser(
    userId: string,
    {
      limit,
      page,
      cursor,
      sort,
      include,
      search,
      itemsLimit,
      systemType,
    }: ListSearchDto
  ) {
    const where: Prisma.ListWhereInput = {
      userId,
      name: search && { contains: search },
      systemType: systemType && { in: systemType },
    };
    const args: Prisma.ListFindManyArgs = {
      where,
      orderBy: sort,
      include: include && this.mapInclude(include, itemsLimit),
    };

    if (page) {
      args.take = limit;
      args.skip = (page - 1) * limit;
    } else {
      args.take = limit + 1;
      if (cursor) {
        args.cursor = { id: cursor };
      }
    }

    return this.prisma.list
      .findMany(args)
      .then((lists) => lists.map((list) => this.mapStats(list)));
  }

  async searchAndCountByUser(
    userId: string,
    {
      limit,
      page,
      cursor,
      sort,
      include,
      search,
      itemsLimit,
      systemType,
    }: ListSearchDto
  ): Promise<[List[], number]> {
    const where: Prisma.ListWhereInput = {
      userId,
      name: search && { contains: search },
      systemType: systemType && { in: systemType },
    };
    const args: Prisma.ListFindManyArgs = {
      where,
      orderBy: sort,
      include: include && this.mapInclude(include, itemsLimit),
    };

    if (page) {
      args.take = limit;
      args.skip = (page - 1) * limit;
    } else {
      args.take = limit + 1;
      if (cursor) {
        args.cursor = { id: cursor };
      }
    }

    const [data, count] = await this.prisma.$transaction([
      this.prisma.list.findMany(args),
      this.prisma.list.count({ where }),
    ]);

    return [data.map((list) => this.mapStats(list)), count];
  }

  async getInclusionState(
    userId: string,
    articleId: string
  ): Promise<ListInclusionStateDto> {
    const lists = await this.prisma.list.findMany({
      where: {
        userId,
        items: { some: { articleId } },
      },
      select: {
        id: true,
        systemType: true,
      },
    });

    const result: ListInclusionStateDto = {
      isFavorite: false,
      isReadLater: false,
      customListsIds: [],
    };

    for (const list of lists) {
      switch (list.systemType) {
        case 'FAVORITE':
          result.isFavorite = true;
          break;
        case 'READ_LATER':
          result.isReadLater = true;
          break;
        default:
          result.customListsIds.push(list.id);
          break;
      }
    }

    return result;
  }

  async update(id: string, input: UpdateListDto): Promise<List> {
    return this.mapStats(
      await this.prisma.list.update({
        where: { id },
        data: input,
      })
    );
  }

  async delete(id: string): Promise<List> {
    return this.mapStats(await this.prisma.list.delete({ where: { id } }));
  }
}
