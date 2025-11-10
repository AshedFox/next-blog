import { CreateArticleDto } from './dto/create-article.dto';

export type CreateArticleInput = CreateArticleDto & {
  authorId: string;
};

export const VideoProvider = { YOUTUBE: 'YOUTUBE', VIMEO: 'VIMEO' } as const;

export type VideoProvider = (typeof VideoProvider)[keyof typeof VideoProvider];

export const ArticleBlockType = {
  PARAGRAPH: 'PARAGRAPH',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  CODE: 'CODE',
  QUOTE: 'QUOTE',
} as const;

export type ArticleBlockType =
  (typeof ArticleBlockType)[keyof typeof ArticleBlockType];
