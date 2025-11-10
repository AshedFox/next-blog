import { ArticleStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';

import { UserDto } from '@/user/dto/user.dto';

import {
  ArticleBlockDto,
  ArticleBlockType,
  CodeBlockDto,
  ImageBlockDto,
  ParagraphBlockDto,
  QuoteBlockDto,
  VideoBlockDto,
} from './article-block.dto';

export class ArticleDto {
  id!: string;
  title!: string;
  status!: ArticleStatus;
  createdAt!: Date;
  updatedAt!: Date;
  authorId!: string;
  deletedAt?: Date;

  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: ParagraphBlockDto, name: ArticleBlockType.PARAGRAPH },
        { value: ImageBlockDto, name: ArticleBlockType.IMAGE },
        { value: VideoBlockDto, name: ArticleBlockType.VIDEO },
        { value: CodeBlockDto, name: ArticleBlockType.CODE },
        { value: QuoteBlockDto, name: ArticleBlockType.QUOTE },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ArrayNotEmpty()
  blocks!: ArticleBlockDto[];

  @Type(() => UserDto)
  author?: UserDto;

  constructor(article: Article) {
    Object.assign(this, article);
  }
}
