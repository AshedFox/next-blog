import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDefined,
  Length,
  ValidateNested,
} from 'class-validator';

import { ArticleBlockType } from '../article.types';
import {
  CreateArticleBlockDto,
  CreateCodeBlockDto,
  CreateImageBlockDto,
  CreateParagraphBlockDto,
  CreateQuoteBlockDto,
  CreateVideoBlockDto,
} from './create-article-block.dto';

export class CreateArticleDto {
  @Length(2, 127)
  title!: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: CreateParagraphBlockDto, name: ArticleBlockType.PARAGRAPH },
        { value: CreateImageBlockDto, name: ArticleBlockType.IMAGE },
        { value: CreateVideoBlockDto, name: ArticleBlockType.VIDEO },
        { value: CreateCodeBlockDto, name: ArticleBlockType.CODE },
        { value: CreateQuoteBlockDto, name: ArticleBlockType.QUOTE },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  @ArrayNotEmpty()
  blocks!: CreateArticleBlockDto[];
}
