import { Equals, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export const ArticleBlockType = {
  PARAGRAPH: 'PARAGRAPH',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  CODE: 'CODE',
  QUOTE: 'QUOTE',
} as const;

export type ArticleBlockType =
  (typeof ArticleBlockType)[keyof typeof ArticleBlockType];

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

  @IsOptional()
  @IsString()
  @Length(1, 127)
  alt?: string;
}

export class VideoBlockDto {
  @Equals(ArticleBlockType.VIDEO)
  type!: typeof ArticleBlockType.VIDEO;

  @IsUrl()
  url!: string;
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
