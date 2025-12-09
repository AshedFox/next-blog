export const ArticleListStyle = {
  BULLET: 'bullet',
  ORDERED: 'ordered',
} as const;

export type ArticleListStyle =
  (typeof ArticleListStyle)[keyof typeof ArticleListStyle];

export function isArticleListStyle(value: unknown): value is ArticleListStyle {
  return ARTICLE_LIST_STYLE_VALUES.includes(value as ArticleListStyle);
}

export const ARTICLE_LIST_STYLE_VALUES = Object.values(
  ArticleListStyle
) as ArticleListStyle[];

export const ARTICLE_LIST_STYLE_KEYS = Object.keys(ArticleListStyle) as Array<
  keyof typeof ArticleListStyle
>;
