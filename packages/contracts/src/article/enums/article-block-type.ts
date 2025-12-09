export const ArticleBlockType = {
  PARAGRAPH: 'PARAGRAPH',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  CODE: 'CODE',
  QUOTE: 'QUOTE',
  HEADING: 'HEADING',
  LIST: 'LIST',
  DIVIDER: 'DIVIDER',
} as const;

export type ArticleBlockType =
  (typeof ArticleBlockType)[keyof typeof ArticleBlockType];

export const ARTICLE_BLOCK_TYPE_VALUES = Object.values(
  ArticleBlockType
) as ArticleBlockType[];

export const ARTICLE_BLOCK_TYPE_KEYS = Object.keys(ArticleBlockType) as Array<
  keyof typeof ArticleBlockType
>;

export function isArticleBlockType(value: unknown): value is ArticleBlockType {
  return ARTICLE_BLOCK_TYPE_VALUES.includes(value as ArticleBlockType);
}
