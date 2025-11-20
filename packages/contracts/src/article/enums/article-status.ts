export const ArticleStatus = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  REJECTED: 'REJECTED',
  PUBLISHED: 'PUBLISHED',
} as const;

export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus];

export function isArticleStatus(value: unknown): value is ArticleStatus {
  return ARTICLE_STATUS_VALUES.includes(value as ArticleStatus);
}

export const ARTICLE_STATUS_VALUES = Object.values(
  ArticleStatus
) as ArticleStatus[];

export const ARTICLE_STATUS_KEYS = Object.keys(ArticleStatus) as Array<
  keyof typeof ArticleStatus
>;
