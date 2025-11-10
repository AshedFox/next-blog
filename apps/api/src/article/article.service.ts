import { Injectable, NotFoundException } from '@nestjs/common';
import { Article, ArticleStatus, Prisma } from '@prisma/client';

import {
  mapFilterToPrisma,
  PaginationType,
  ParsedFilters,
} from '@/common/search';
import { DeletedMode, getDeletedFilter } from '@/common/soft-delete';
import { FileService } from '@/file/file.service';
import { PrismaService } from '@/prisma/prisma.service';

import { ArticleBlockType, CreateArticleInput } from './article.types';
import { ARTICLE_SEARCH_CONFIG } from './article-search.config';
import { ArticleBlockDto } from './dto/article-block.dto';
import { ArticleSearchDto } from './dto/article-search.dto';
import { CreateArticleBlockDto } from './dto/create-article-block.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileSerivce: FileService
  ) {}

  create(input: CreateArticleInput): Promise<Article> {
    return this.prisma.article.create({
      data: {
        ...input,
        blocks: input.blocks.map((block) => ({ ...block })),
      },
    });
  }

  private buildFiltersWhere(
    filters: ParsedFilters<Article>
  ): Prisma.ArticleWhereInput {
    const where: Prisma.ArticleWhereInput = {};

    for (const [field, fieldFilters] of Object.entries(filters)) {
      if (!fieldFilters?.length) {
        continue;
      }

      where[field as keyof Article] = fieldFilters.reduce(
        (acc, filter) => ({ ...acc, ...mapFilterToPrisma(filter) }),
        {} as Record<string, unknown>
      );
    }

    return where;
  }

  private parseSearchQueryToArgs(
    query: ArticleSearchDto
  ): Prisma.ArticleFindManyArgs {
    const args: Prisma.ArticleFindManyArgs = {};

    const pagination = query.getPagination();

    if (pagination.type === PaginationType.OFFSET) {
      args.take = pagination.limit;
      args.skip = (pagination.page - 1) * pagination.limit;
    } else if (pagination.type === PaginationType.CURSOR) {
      args.take = pagination.limit + 1;
      args.cursor = query.cursor ? { id: query.cursor } : undefined;
    }

    if (query.include.length > 0) {
      args.include = query.include.reduce((acc, item) => {
        acc[item] = true;
        return acc;
      }, {} as Prisma.ArticleInclude);
    }

    if (query.sort.length > 0) {
      args.orderBy = query.sort.reduce((acc, item) => {
        acc[item.field] = item.direction;
        return acc;
      }, {} as Prisma.ArticleOrderByWithRelationInput);
    }

    if (query.search) {
      args.where = {
        OR: ARTICLE_SEARCH_CONFIG.searchableFields?.map(
          (field) =>
            ({
              [field]: { contains: query.search, mode: 'insensitive' },
            }) as Prisma.ArticleWhereInput
        ),
      };
    }

    if (query.filters && Object.keys(query.filters).length > 0) {
      const filterWhere = this.buildFiltersWhere(query.filters);
      args.where = {
        ...args.where,
        ...filterWhere,
      };
    }

    return args;
  }

  async search(query: ArticleSearchDto): Promise<Article[]> {
    return this.prisma.article.findMany(this.parseSearchQueryToArgs(query));
  }

  async searchAndCount(query: ArticleSearchDto): Promise<[Article[], number]> {
    const args = this.parseSearchQueryToArgs(query);

    return this.prisma.$transaction([
      this.prisma.article.findMany(args),
      this.prisma.article.count({
        where: args.where,
      }),
    ]);
  }

  async findOne(
    id: string,
    mode: DeletedMode = 'exclude',
    include: (keyof Prisma.ArticleInclude)[] = []
  ): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: {
        id,
        deletedAt: getDeletedFilter(mode),
      },
      include:
        include.length > 0
          ? include.reduce((acc, item) => {
              acc[item] = true;
              return acc;
            }, {} as Prisma.ArticleInclude)
          : undefined,
    });
  }

  async getOne(
    id: string,
    mode: DeletedMode = 'exclude',
    include: (keyof Prisma.ArticleInclude)[] = []
  ): Promise<Article> {
    const article = await this.findOne(id, mode, include);

    if (!article) {
      throw new NotFoundException('Article not found!');
    }

    return article;
  }

  async update(id: string, input: UpdateArticleDto): Promise<Article> {
    const article = await this.getOne(id);

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        ...input,
        blocks: input.blocks
          ? input.blocks.map((block) => ({ ...block }))
          : undefined,
      },
    });

    if (input.blocks) {
      await this.fileSerivce.markManyAsDeleted(
        this.getRemovedImagesIds(
          article.blocks as unknown as ArticleBlockDto[],
          input.blocks
        )
      );
    }

    return updated;
  }

  async restore(id: string): Promise<Article> {
    await this.getOne(id, DeletedMode.ONLY);

    return this.prisma.article.restore({ where: { id } });
  }

  async changeStatus(id: string, status: ArticleStatus): Promise<Article> {
    await this.getOne(id);

    return this.prisma.article.update({
      where: { id },
      data: { status },
    });
  }

  async softDelete(id: string): Promise<Article> {
    await this.getOne(id);

    return this.prisma.article.softDelete({
      where: { id },
    });
  }

  private getRemovedImagesIds(
    oldBlocks: ArticleBlockDto[],
    newBlocks: CreateArticleBlockDto[]
  ): string[] {
    const oldImagesIds = new Set<string>();

    for (const block of oldBlocks) {
      if (block.type === ArticleBlockType.IMAGE) {
        oldImagesIds.add(block.fileId);
      }
    }

    if (oldImagesIds.size === 0) {
      return [];
    }

    for (const block of newBlocks) {
      if (block.type === ArticleBlockType.IMAGE) {
        oldImagesIds.delete(block.fileId);
      }
    }

    console.log(oldImagesIds);

    return Array.from(oldImagesIds);
  }
}
