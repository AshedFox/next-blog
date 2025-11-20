import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ArticleStatus, User, UserRole } from '@prisma/client';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { MinRole } from '@/auth/decorators/min-role.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { DeletedMode } from '@/common/soft-delete/deleted-filter';

import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { ArticleGetOneDto } from './dto/article-get-one.dto';
import { ArticleSearchDto } from './dto/article-search.dto';
import { ArticleSearchResponseDto } from './dto/article-search-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ZodResponse({ type: ArticleDto, status: 200 })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser('id') userId: string
  ) {
    return this.articleService.enrich(
      await this.articleService.create({
        ...createArticleDto,
        authorId: userId,
      })
    );
  }

  @Public()
  @Get(':id')
  @ZodResponse({ type: ArticleDto })
  async getOne(@Param('id') id: string, @Query() query: ArticleGetOneDto) {
    return this.articleService.enrich(
      await this.articleService.getOne(id, undefined, query.include)
    );
  }

  @Public()
  @Get()
  @ZodResponse({ type: ArticleSearchResponseDto })
  async search(@Query() query: ArticleSearchDto) {
    const { page, limit } = query;

    if (!page) {
      const data = await this.articleService.search(query);
      const hasNextPage = data.length > limit;

      return {
        data: data
          .slice(0, limit)
          .map((article) => this.articleService.enrich(article)),
        meta: {
          limit,
          cursor: hasNextPage ? data[data.length - 1]!.id : undefined,
          hasNextPage,
        },
      };
    }

    const [data, count] = await this.articleService.searchAndCount(query);
    const totalPages = Math.ceil(count / limit);

    return {
      data: data.map((article) => this.articleService.enrich(article)),
      meta: {
        limit,
        totalCount: count,
        totalPages,
        page,
        hasNextPage: count > page * limit,
        hasPreviousPage: page > 1 && page - 1 <= totalPages,
      },
    };
  }

  @Patch(':id')
  @ZodResponse({ type: ArticleDto })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    return this.articleService.enrich(
      await this.articleService.update(id, updateArticleDto)
    );
  }

  @Post(':id/restore')
  @ZodResponse({ type: ArticleDto, status: 200 })
  async restore(@Param('id') id: string, @CurrentUser() user: User) {
    const article = await this.articleService.getOne(id, DeletedMode.ONLY);

    if (article.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        "You don't have access to restore this article"
      );
    }

    return this.articleService.enrich(await this.articleService.restore(id));
  }

  @Post(':id/request-publish')
  @ZodResponse({ type: ArticleDto, status: 200 })
  async publish(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const article = await this.articleService.getOne(id);

    if (article.authorId !== userId) {
      throw new ForbiddenException(
        "You don't have access to request publish for this article"
      );
    }

    return this.articleService.enrich(
      await this.articleService.changeStatus(id, ArticleStatus.IN_REVIEW)
    );
  }

  @MinRole(UserRole.ADMIN)
  @Post(':id/approve')
  @ZodResponse({ type: ArticleDto, status: 200 })
  async approve(@Param('id') id: string) {
    return this.articleService.enrich(
      await this.articleService.changeStatus(id, ArticleStatus.PUBLISHED)
    );
  }

  @MinRole(UserRole.ADMIN)
  @Post(':id/reject')
  @ZodResponse({ type: ArticleDto, status: 200 })
  async reject(@Param('id') id: string) {
    return this.articleService.enrich(
      await this.articleService.changeStatus(id, ArticleStatus.REJECTED)
    );
  }

  @Delete(':id')
  @ZodResponse({ type: ArticleDto })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    const article = await this.articleService.getOne(id);

    if (article.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        "You don't have access to delete this article"
      );
    }

    return this.articleService.enrich(await this.articleService.softDelete(id));
  }
}
