import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ListItemGetOneDto,
  ListItemInclude,
  ListItemSearchDto,
  SystemListType,
} from '@workspace/contracts';

import { Prisma } from '@/prisma/generated/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ListItemService {
  constructor(private readonly prisma: PrismaService) {}

  private mapInclude(
    include: ListItemInclude[] = []
  ): Prisma.ListItemInclude | undefined {
    return include.length > 0
      ? Object.fromEntries(include.map((item) => [item, true]))
      : undefined;
  }

  async addToSystemList(
    userId: string,
    articleId: string,
    type: SystemListType
  ) {
    return this.prisma.$transaction(async (tx) => {
      const list = await tx.list.upsert({
        where: { userId_systemType: { userId, systemType: type } },
        update: {},
        create: { userId, systemType: type, name: String(type) },
      });

      return tx.listItem.upsert({
        where: { articleId_listId: { listId: list.id, articleId } },
        update: {},
        create: { listId: list.id, articleId },
      });
    });
  }

  async addToList(userId: string, listId: string, articleId: string) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }
    if (list.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to add item to this list'
      );
    }

    return this.prisma.listItem.upsert({
      where: { articleId_listId: { listId, articleId } },
      update: {},
      create: { listId, articleId },
    });
  }

  findOne(
    userId: string,
    listId: string,
    articleId: string,
    query: ListItemGetOneDto
  ) {
    return this.prisma.listItem.findUnique({
      where: {
        articleId_listId: { listId, articleId },
        list: { OR: [{ isPublic: true }, { userId }] },
      },
      include: this.mapInclude(query.include),
    });
  }

  async getOne(
    userId: string,
    listId: string,
    articleId: string,
    query: ListItemGetOneDto
  ) {
    const listItem = await this.findOne(userId, listId, articleId, query);
    if (!listItem) {
      throw new NotFoundException('List item not found');
    }
    return listItem;
  }

  searchByList(
    userId: string,
    listId: string,
    { limit, cursor, page, sort }: ListItemSearchDto
  ) {
    return this.prisma.listItem.findMany({
      where: { listId, list: { OR: [{ isPublic: true }, { userId }] } },
      take: limit,
      skip: page && (page - 1) * limit,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: sort,
    });
  }

  searchAndCountByList(
    userId: string,
    listId: string,
    { limit, cursor, page, sort }: ListItemSearchDto
  ) {
    const where: Prisma.ListItemWhereInput = {
      listId,
      list: { OR: [{ isPublic: true }, { userId }] },
    };
    return this.prisma.$transaction([
      this.prisma.listItem.findMany({
        where,
        take: limit,
        skip: page && (page - 1) * limit,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: sort,
      }),
      this.prisma.listItem.count({ where }),
    ]);
  }

  async delete(userId: string, listId: string, articleId: string) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }
    if (list.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this item');
    }

    return this.prisma.listItem.delete({
      where: { articleId_listId: { listId, articleId } },
    });
  }

  async deleteFromSystemList(
    userId: string,
    articleId: string,
    type: SystemListType
  ) {
    const list = await this.prisma.list.findUnique({
      where: { userId_systemType: { userId, systemType: type } },
    });

    if (!list) {
      throw new NotFoundException('List not found');
    }

    return this.prisma.listItem.delete({
      where: { articleId_listId: { listId: list.id, articleId } },
    });
  }
}
