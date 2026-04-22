export const ArticleModerationInclude = {
  admin: 'admin',
  article: 'article',
} as const;

export type ArticleModerationInclude =
  (typeof ArticleModerationInclude)[keyof typeof ArticleModerationInclude];

export function isArticleModerationInclude(
  value: unknown
): value is ArticleModerationInclude {
  return ARTICLE_MODERATION_INCLUDE_VALUES.includes(
    value as ArticleModerationInclude
  );
}

export const ARTICLE_MODERATION_INCLUDE_KEYS = Object.keys(
  ArticleModerationInclude
) as Array<keyof typeof ArticleModerationInclude>;

export const ARTICLE_MODERATION_INCLUDE_VALUES = Object.values(
  ArticleModerationInclude
) as ArticleModerationInclude[];
