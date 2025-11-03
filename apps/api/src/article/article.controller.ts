import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ArticleStatus, User, UserRole } from '@prisma/client';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { MinRole } from '@/auth/decorators/min-role.decorator';
import { Public } from '@/auth/decorators/public.decorator';
import { PaginationType } from '@/common/search/types/pagination.types';
import { DeletedMode } from '@/common/soft-delete/deleted-filter';

import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { ArticleSearchDto } from './dto/article-search.dto';
import { ArticleSearchResponseDto } from './dto/article-search-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser('id') userId: string
  ): Promise<ArticleDto> {
    return new ArticleDto(
      await this.articleService.create({
        ...createArticleDto,
        authorId: userId,
      })
    );
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<ArticleDto> {
    return new ArticleDto(await this.articleService.getOne(id));
  }

  @Public()
  @Get()
  async search(
    @Query() query: ArticleSearchDto
  ): Promise<ArticleSearchResponseDto> {
    const pagination = query.getPagination();

    if (pagination.type === PaginationType.CURSOR) {
      const data = await this.articleService.search(query);
      const hasNextPage = data.length > pagination.limit;

      return {
        data: data
          .slice(0, pagination.limit)
          .map((article) => new ArticleDto(article)),
        meta: {
          limit: pagination.limit,
          nextCursor: hasNextPage ? data[data.length - 1]!.id : undefined,
          hasNextPage,
        },
      };
    }

    const [data, count] = await this.articleService.searchAndCount(query);
    const totalPages = Math.ceil(count / pagination.limit);

    return {
      data: data.map((article) => new ArticleDto(article)),
      meta: {
        limit: pagination.limit,
        totalCount: count,
        totalPages,
        page: pagination.page,
        hasNextPage: count > pagination.page * pagination.limit,
        hasPreviousPage:
          pagination.page > 1 && pagination.page - 1 <= totalPages,
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto
  ): Promise<ArticleDto> {
    return new ArticleDto(
      await this.articleService.update(id, updateArticleDto)
    );
  }

  @HttpCode(200)
  @Post(':id/restore')
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<ArticleDto> {
    const article = await this.articleService.getOne(id, DeletedMode.ONLY);

    if (article.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        "You don't have access to restore this article"
      );
    }

    return new ArticleDto(await this.articleService.restore(id));
  }

  @HttpCode(200)
  @Post(':id/request-publish')
  async publish(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ): Promise<ArticleDto> {
    const article = await this.articleService.getOne(id);

    if (article.authorId !== userId) {
      throw new ForbiddenException(
        "You don't have access to request publish for this article"
      );
    }

    return new ArticleDto(
      await this.articleService.changeStatus(id, ArticleStatus.IN_REVIEW)
    );
  }

  @HttpCode(200)
  @MinRole(UserRole.ADMIN)
  @Post(':id/approve')
  async approve(@Param('id') id: string): Promise<ArticleDto> {
    return new ArticleDto(
      await this.articleService.changeStatus(id, ArticleStatus.PUBLISHED)
    );
  }

  @HttpCode(200)
  @MinRole(UserRole.ADMIN)
  @Post(':id/reject')
  async reject(@Param('id') id: string): Promise<ArticleDto> {
    return new ArticleDto(
      await this.articleService.changeStatus(id, ArticleStatus.REJECTED)
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<ArticleDto> {
    const article = await this.articleService.getOne(id);

    if (article.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        "You don't have access to delete this article"
      );
    }

    return new ArticleDto(await this.articleService.softDelete(id));
  }
}
