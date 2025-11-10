import { Injectable, NotFoundException } from '@nestjs/common';
import { Article, ArticleStatus, Prisma } from '@prisma/client';

import {
  mapFilterToPrisma,
  PaginationType,
  ParsedFilters,
} from '@/common/search';
import { DeletedMode, getDeletedFilter } from '@/common/soft-delete';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateArticleInput } from './article.types';
import { ARTICLE_SEARCH_CONFIG } from './article-search.config';
import { ArticleSearchDto } from './dto/article-search.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

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
    await this.getOne(id);

    return this.prisma.article.update({
      where: { id },
      data: {
        ...input,
        blocks: input.blocks
          ? input.blocks.map((block) => ({ ...block }))
          : undefined,
      },
    });
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
}
