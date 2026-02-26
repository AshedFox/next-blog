import { Injectable } from '@nestjs/common';
import { Article, Prisma } from '@prisma/client';
import {
  ArticleBlockDto,
  ArticleBlockType,
  ArticleInDto,
  VideoProvider,
} from '@workspace/contracts';

import { StorageService } from '@/storage/storage.service';
import { UserMapper, UserWithRelations } from '@/user/user.mapper';

export type ArticleWithRelations = Article & {
  author?: UserWithRelations;
  comments?: Prisma.CommentGetPayload<Prisma.CommentDefaultArgs>[];
};

@Injectable()
export class ArticleMapper {
  constructor(
    private readonly storageService: StorageService,
    private readonly userMapper: UserMapper
  ) {}

  private enrichBlocks(blocks: Prisma.JsonArray): ArticleBlockDto[] {
    return blocks.map((value) => {
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
    });
  }

  map(article: ArticleWithRelations): ArticleInDto {
    const dto: ArticleInDto = {
      ...article,
      blocks: this.enrichBlocks(article.blocks as Prisma.JsonArray),
    };

    if (article.author) {
      dto.author = this.userMapper.map(article.author);
    }

    if ('comments' in article && article.comments) {
      dto.comments = article.comments;
    }

    return dto;
  }

  mapMany(articles: ArticleWithRelations[]): ArticleInDto[] {
    return articles.map((article) => this.map(article));
  }
}
