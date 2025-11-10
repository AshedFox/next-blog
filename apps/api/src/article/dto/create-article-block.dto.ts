import { OmitType } from '@nestjs/mapped-types';

import {
  CodeBlockDto,
  ImageBlockDto,
  ParagraphBlockDto,
  QuoteBlockDto,
  VideoBlockDto,
} from './article-block.dto';

export class CreateParagraphBlockDto extends ParagraphBlockDto {}

export class CreateImageBlockDto extends OmitType(ImageBlockDto, ['url']) {}

export class CreateVideoBlockDto extends OmitType(VideoBlockDto, [
  'embedUrl',
]) {}

export class CreateCodeBlockDto extends CodeBlockDto {}

export class CreateQuoteBlockDto extends QuoteBlockDto {}

export type CreateArticleBlockDto =
  | CreateParagraphBlockDto
  | CreateImageBlockDto
  | CreateVideoBlockDto
  | CreateCodeBlockDto
  | CreateQuoteBlockDto;
