import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ListGetOneDto,
  ListInclude,
  ListSearchDto,
  UpdateListDto,
} from '@workspace/contracts';

import { List, Prisma } from '@/prisma/generated/client';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateListInput, ListInclusionState } from '../list.types';

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
    { include, itemsLimit }: ListGetOneDto,
    currentUserId?: string
  ): Promise<List | null> {
    const list = await this.prisma.list.findUnique({
      where: { id, isPublic: currentUserId !== id ? true : undefined },
      include: include && this.mapInclude(include, itemsLimit),
    });
    return list ? this.mapStats(list) : null;
  }

  async getOne(
    id: string,
    query: ListGetOneDto,
    currentUserId?: string
  ): Promise<List> {
    const list = await this.findOne(id, query, currentUserId);
    if (!list) {
      throw new NotFoundException('List not found');
    }
    return list;
  }

  async searchByUser(
    targetUserId: string,
    {
      limit,
      page,
      cursor,
      sort,
      include,
      search,
      itemsLimit,
      systemType,
      excludeArticlesIds,
    }: ListSearchDto,
    currentUserId?: string
  ) {
    const where: Prisma.ListWhereInput = {
      userId: targetUserId,
      isPublic: currentUserId !== targetUserId ? true : undefined,
      name: search ? { contains: search } : undefined,
      systemType: systemType && { in: systemType },
      items: excludeArticlesIds && {
        none: { articleId: { in: excludeArticlesIds } },
      },
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
    targetUserId: string,
    {
      limit,
      page,
      cursor,
      sort,
      include,
      search,
      itemsLimit,
      systemType,
      excludeArticlesIds,
    }: ListSearchDto,
    currentUserId?: string
  ): Promise<[List[], number]> {
    const where: Prisma.ListWhereInput = {
      userId: targetUserId,
      isPublic: currentUserId !== targetUserId ? true : undefined,
      name: search ? { contains: search } : undefined,
      systemType: systemType && { in: systemType },
      items: excludeArticlesIds && {
        none: { articleId: { in: excludeArticlesIds } },
      },
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
  ): Promise<ListInclusionState> {
    const lists = await this.prisma.list.findMany({
      where: {
        userId,
        items: { some: { articleId } },
      },
    });

    const result: ListInclusionState = {
      isFavorite: false,
      isReadLater: false,
      includedInCustomLists: [],
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
          result.includedInCustomLists.push(list);
          break;
      }
    }

    return result;
  }

  async update(
    id: string,
    input: UpdateListDto,
    currentUserId: string
  ): Promise<List> {
    return this.prisma.list.update({
      where: { id, userId: currentUserId },
      data: input,
    });
  }

  async delete(id: string, currentUserId: string): Promise<List> {
    return this.prisma.list.delete({ where: { id, userId: currentUserId } });
  }
}
