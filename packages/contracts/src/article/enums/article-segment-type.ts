export const ArticleSegmentType = {
  BREAK: 'BREAK',
  TEXT: 'TEXT',
} as const;

export type ArticleSegmentType =
  (typeof ArticleSegmentType)[keyof typeof ArticleSegmentType];

export const ARTICLE_SEGMENT_TYPE_VALUES = Object.values(
  ArticleSegmentType
) as ArticleSegmentType[];

export const ARTICLE_SEGMENT_TYPE_KEYS = Object.keys(
  ArticleSegmentType
) as Array<keyof typeof ArticleSegmentType>;

export function isArticleSegmentType(
  value: unknown
): value is ArticleSegmentType {
  return ARTICLE_SEGMENT_TYPE_VALUES.includes(value as ArticleSegmentType);
}
