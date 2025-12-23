import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Article, ArticleStatus, Prisma } from '@prisma/client';
import slugify from '@sindresorhus/slugify';
import {
  ArticleBlockDto,
  ArticleBlockType,
  ArticleFilters,
  type ArticleInclude,
  ArticleInDto,
  CreateArticleBlockDto,
  CreateImageBlockDto,
  VideoProvider,
} from '@workspace/contracts';
import { randomBytes } from 'crypto';
import z from 'zod';

import { DeletedMode, getDeletedFilter } from '@/common/soft-delete';
import { FileService } from '@/file/file.service';
import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';

import { CreateArticleInput } from './article.types';
import { ArticleSearchDto } from './dto/article-search.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { dbArticleSchema } from './schemas/db-article.schema';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly storageService: StorageService
  ) {}

  private async validateImageBlocks(blocks: CreateImageBlockDto[]) {
    if (blocks.length === 0) {
      return;
    }

    const ids = blocks.map((b) => b.fileId);

    const existingFiles = await this.fileService.findMany(ids);

    const existingIds = new Set(existingFiles.map((f) => f.id));

    const missing: { blockIndex: number; fileId: string }[] = [];

    blocks.forEach((block, index) => {
      if (block.type !== ArticleBlockType.IMAGE) {
        return;
      }

      if (!existingIds.has(block.fileId)) {
        missing.push({ blockIndex: index, fileId: block.fileId });
      }
    });

    if (missing.length > 0) {
      throw new BadRequestException(
        missing.map((m) => `blocks.${m.blockIndex}.fileId file does not exist`)
      );
    }
  }

  enrich(article: Article): ArticleInDto {
    return {
      ...article,
      blocks: (article.blocks as Prisma.JsonArray).map((value) => {
        const block = value as ArticleBlockDto;

        if (block.type === ArticleBlockType.IMAGE) {
          block.url = this.storageService.getPublicUrl(block.fileId);
        } else if (block.type === ArticleBlockType.VIDEO) {
          if (block.provider === VideoProvider.YOUTUBE) {
            block.embedUrl = `https://www.youtube.com/embed/${block.videoId}`;
          } else if (block.provider === VideoProvider.VIMEO) {
            block.embedUrl = `https://player.vimeo.com/video/${block.videoId}`;
          }
        }

        return block;
      }),
    };
  }

  async create(input: CreateArticleInput): Promise<Article> {
    await this.validateImageBlocks(
      input.blocks.filter((block) => block.type === ArticleBlockType.IMAGE)
    );

    let slug = slugify(input.title);

    const article = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      return this.prisma.article.create({ data: { ...input, slug } });
    }

    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        slug = slugify(
          `${input.title}-${randomBytes(6).toString('base64url')}`
        );

        return this.prisma.article.create({ data: { ...input, slug } });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            if (attempt === maxAttempts - 1) {
              throw new InternalServerErrorException(
                'Failed to generate unique slug'
              );
            }
            continue;
          }
        }
        throw error;
      }
    }

    throw new InternalServerErrorException(
      'Impossible happended, unable to create article'
    );
  }

  private getRankSql(search: string): Prisma.Sql {
    return Prisma.sql`(
      ts_rank_cd("searchVector", websearch_to_tsquery('russian', ${search})) +
      ts_rank_cd("searchVector", websearch_to_tsquery('english', ${search}))
    )`;
  }

  private buildRawWhere(
    filters: ArticleFilters,
    search?: string
  ): Prisma.Sql[] {
    const where: Prisma.Sql[] = [];

    if (search) {
      where.push(Prisma.sql`(
        "searchVector" @@ websearch_to_tsquery('english', ${search}) OR
        "searchVector" @@ websearch_to_tsquery('russian', ${search})
      )`);
    }

    if (filters.authorId?.length) {
      where.push(Prisma.sql`"authorId" IN (${Prisma.join(filters.authorId)})`);
    }

    if (filters.status?.length) {
      where.push(
        Prisma.sql`"status"::text IN (${Prisma.join(filters.status)})`
      );
    }

    if (filters.createdAtGte) {
      where.push(Prisma.sql`"createdAt" >= ${filters.createdAtGte}`);
    }

    if (filters.createdAtLte) {
      where.push(Prisma.sql`"createdAt" <= ${filters.createdAtLte}`);
    }

    return where;
  }

  private buildFiltersWhere(filters: ArticleFilters): Prisma.ArticleWhereInput {
    const where: Prisma.ArticleWhereInput = {};

    if (filters.authorId?.length) {
      where.authorId = { in: filters.authorId };
    }

    if (filters.status?.length) {
      where.status = { in: filters.status };
    }

    if (filters.createdAtGte || filters.createdAtLte) {
      where.createdAt = {
        gte: filters.createdAtGte,
        lte: filters.createdAtLte,
      };
    }

    return where;
  }

  private parseSearchQueryToArgs(
    query: ArticleSearchDto
  ): Prisma.ArticleFindManyArgs {
    const { page, limit, cursor, include, sort, ...filters } = query;
    const args: Prisma.ArticleFindManyArgs = {
      include: include?.reduce((acc, i) => ({ ...acc, [i]: true }), {}),
    };

    if (page) {
      args.take = limit;
      args.skip = (page - 1) * limit;
    } else {
      args.take = limit;
      if (cursor) {
        args.cursor = { id: cursor };
      }
    }

    if (sort) {
      args.orderBy = Object.entries(sort).map(([field, direction]) => ({
        [field]: direction,
      }));
    }

    args.where = this.buildFiltersWhere(filters);

    return args;
  }

  private async rawSearch(query: ArticleSearchDto): Promise<Article[]> {
    const { page, limit, include, search, sort, ...filters } = query;

    const where = this.buildRawWhere(filters, search);
    const whereClause =
      where.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(where, ' AND ')}`
        : Prisma.empty;

    const rankCalculation = this.getRankSql(search!);

    const orderBy: Prisma.Sql[] = [];
    if (sort) {
      Object.entries(sort).forEach(([field, direction]) => {
        orderBy.push(
          Prisma.sql`"${Prisma.raw(field)}" ${Prisma.raw(direction)}`
        );
      });
    }
    orderBy.push(Prisma.sql`${rankCalculation} DESC`, Prisma.sql`id ASC`);

    const orderByClause =
      orderBy.length > 0
        ? Prisma.sql`ORDER BY ${Prisma.join(orderBy, ', ')}`
        : Prisma.empty;

    const selects: Prisma.Sql[] = [
      Prisma.sql`
        "Article"."id",
        "Article"."slug",
        "Article"."title",
        "Article"."blocks",
        "Article"."status",
        "Article"."createdAt",
        "Article"."updatedAt",
        "Article"."deletedAt",
        "Article"."authorId"
      `,
    ];
    const joins: Prisma.Sql[] = [];

    if (include?.includes('author')) {
      selects.push(Prisma.sql`row_to_json("Author".*) as author`);
      joins.push(
        Prisma.sql`LEFT JOIN "User" as "Author" ON "Article"."authorId" = "Author".id`
      );
    }

    const joinsClause =
      joins.length > 0 ? Prisma.join(joins, ' ') : Prisma.empty;

    const offset = page ? (page - 1) * limit : 0;

    const articles = await this.prisma.$queryRaw`
      SELECT ${Prisma.join(selects, ', ')}
      FROM "Article"
      ${joinsClause}
      ${whereClause}
      ${orderByClause}
      LIMIT ${limit} OFFSET ${offset}
    `;

    return z.array(dbArticleSchema).parseAsync(articles);
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
    include: ArticleInclude[] = []
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
    include: ArticleInclude[] = []
  ): Promise<Article> {
    const article = await this.findOne(id, mode, include);

    if (!article) {
      throw new NotFoundException('Article not found!');
    }

    return article;
  }

  async findOneBySlug(
    slug: string,
    mode: DeletedMode = 'exclude',
    include: ArticleInclude[] = []
  ): Promise<Article | null> {
    return this.prisma.article.findUnique({
      where: {
        slug,
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

  async getOneBySlug(
    slug: string,
    mode: DeletedMode = 'exclude',
    include: ArticleInclude[] = []
  ): Promise<Article> {
    const article = await this.findOneBySlug(slug, mode, include);

    if (!article) {
      throw new NotFoundException('Article not found!');
    }

    return article;
  }

  async update(id: string, input: UpdateArticleDto): Promise<Article> {
    const article = await this.getOne(id);

    if (input.blocks) {
      await this.validateImageBlocks(
        input.blocks.filter((block) => block.type === ArticleBlockType.IMAGE)
      );
    }

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
      await this.fileService.markManyAsDeleted(
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

    return Array.from(oldImagesIds);
  }
}
