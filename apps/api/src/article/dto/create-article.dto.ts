import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDefined,
  Length,
  ValidateNested,
} from 'class-validator';

import { ArticleBlockType } from '../article.types';
import {
  ArticleBlockDto,
  CodeBlockDto,
  ImageBlockDto,
  ParagraphBlockDto,
  QuoteBlockDto,
  VideoBlockDto,
} from './article-block.dto';

export class CreateArticleDto {
  @Length(2, 127)
  title!: string;

  @IsDefined()
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
}
