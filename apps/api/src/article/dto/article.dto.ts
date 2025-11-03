import { Article, ArticleStatus } from '@prisma/client';
import { plainToInstance, Transform, Type } from 'class-transformer';

import { UserDto } from '@/user/dto/user.dto';

import { ArticleContentDto } from './article-content.dto';

export class ArticleDto {
  id!: string;
  title!: string;
  status!: ArticleStatus;
  createdAt!: Date;
  updatedAt!: Date;
  authorId!: string;
  deletedAt?: Date;

  @Transform(({ value }) => plainToInstance(ArticleContentDto, value))
  content!: ArticleContentDto;

  @Type(() => UserDto)
  author?: UserDto;

  constructor(article: Article) {
    Object.assign(this, article);
  }
}
