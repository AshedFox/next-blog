export const ArticleInclude = {
  author: 'author',
  comments: 'comments',
} as const;

export type ArticleInclude =
  (typeof ArticleInclude)[keyof typeof ArticleInclude];

export function isArticleInclude(value: unknown): value is ArticleInclude {
  return ARTICLE_INCLUDE_VALUES.includes(value as ArticleInclude);
}

export const ARTICLE_INCLUDE_KEYS = Object.keys(ArticleInclude) as Array<
  keyof typeof ArticleInclude
>;

export const ARTICLE_INCLUDE_VALUES = Object.values(
  ArticleInclude
) as ArticleInclude[];
