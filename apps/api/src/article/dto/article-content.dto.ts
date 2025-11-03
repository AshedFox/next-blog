import { Type } from 'class-transformer';
import { ArrayNotEmpty, ValidateNested } from 'class-validator';

import {
  ArticleBlockType,
  CodeBlockDto,
  ImageBlockDto,
  ParagraphBlockDto,
  QuoteBlockDto,
  VideoBlockDto,
} from './article-block.dto';

export class ArticleContentDto {
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
  blocks!: (
    | ParagraphBlockDto
    | ImageBlockDto
    | VideoBlockDto
    | CodeBlockDto
    | QuoteBlockDto
  )[];
}
