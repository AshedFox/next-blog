import { CreateArticleDto } from './dto/create-article.dto';

export type CreateArticleInput = CreateArticleDto & {
  authorId: string;
};

export const ArticleBlockType = {
  PARAGRAPH: 'PARAGRAPH',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  CODE: 'CODE',
  QUOTE: 'QUOTE',
} as const;

export type ArticleBlockType =
  (typeof ArticleBlockType)[keyof typeof ArticleBlockType];
