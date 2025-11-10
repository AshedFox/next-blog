import {
  Equals,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from 'class-validator';

import { ArticleBlockType, VideoProvider } from '../article.types';

export class ParagraphBlockDto {
  @Equals(ArticleBlockType.PARAGRAPH)
  type!: typeof ArticleBlockType.PARAGRAPH;

  @IsString()
  @Length(2, 127)
  title!: string;

  @IsString()
  @Length(2, 4095)
  content!: string;
}

export class ImageBlockDto {
  @Equals(ArticleBlockType.IMAGE)
  type!: typeof ArticleBlockType.IMAGE;

  @IsUrl()
  url!: string;

  @IsUUID()
  fileId!: string;

  @IsOptional()
  @IsString()
  @Length(1, 127)
  alt?: string;
}

export class VideoBlockDto {
  @Equals(ArticleBlockType.VIDEO)
  type!: typeof ArticleBlockType.VIDEO;

  @IsEnum(VideoProvider)
  provider!: VideoProvider;

  @IsString()
  @Length(1, 127)
  videoId!: string;

  @IsUrl()
  embedUrl!: string;
}

export class CodeBlockDto {
  @Equals(ArticleBlockType.CODE)
  type!: typeof ArticleBlockType.CODE;

  @IsString()
  @Length(2, 1023)
  content!: string;

  @IsOptional()
  @IsString()
  @Length(1, 127)
  language?: string;
}

export class QuoteBlockDto {
  @Equals(ArticleBlockType.QUOTE)
  type!: typeof ArticleBlockType.QUOTE;

  @IsString()
  @Length(2, 511)
  content!: string;

  @IsOptional()
  @IsString()
  @Length(1, 127)
  author?: string;
}

export type ArticleBlockDto =
  | ParagraphBlockDto
  | ImageBlockDto
  | VideoBlockDto
  | CodeBlockDto
  | QuoteBlockDto;
