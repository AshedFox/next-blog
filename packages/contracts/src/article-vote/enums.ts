export const ArticleVoteInclude = {
  user: 'user',
  article: 'article',
} as const;

export type ArticleVoteInclude =
  (typeof ArticleVoteInclude)[keyof typeof ArticleVoteInclude];

export function isArticleVoteInclude(
  value: unknown
): value is ArticleVoteInclude {
  return ARTICLE_VOTE_INCLUDE_VALUES.includes(value as ArticleVoteInclude);
}

export const ARTICLE_VOTE_INCLUDE_KEYS = Object.keys(
  ArticleVoteInclude
) as Array<keyof typeof ArticleVoteInclude>;

export const ARTICLE_VOTE_INCLUDE_VALUES = Object.values(
  ArticleVoteInclude
) as ArticleVoteInclude[];
