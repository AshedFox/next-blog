import { Injectable } from '@nestjs/common';
import { Article } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { StorageService } from '@/storage/storage.service';

import { ArticleBlockType, VideoProvider } from './article.types';
import { ArticleDto } from './dto/article.dto';

@Injectable()
export class ArticleSerializer {
  constructor(private readonly storageService: StorageService) {}

  serialize(article: Article): ArticleDto {
    const articleDto = plainToInstance(ArticleDto, article);

    articleDto.blocks = articleDto.blocks.map((block) => {
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

    return articleDto;
  }
}
