export const CommentVoteInclude = {
  user: 'user',
  comment: 'comment',
} as const;

export type CommentVoteInclude =
  (typeof CommentVoteInclude)[keyof typeof CommentVoteInclude];

export function isCommentVoteInclude(
  value: unknown
): value is CommentVoteInclude {
  return COMMENT_VOTE_INCLUDE_VALUES.includes(value as CommentVoteInclude);
}

export const COMMENT_VOTE_INCLUDE_KEYS = Object.keys(
  CommentVoteInclude
) as Array<keyof typeof CommentVoteInclude>;

export const COMMENT_VOTE_INCLUDE_VALUES = Object.values(
  CommentVoteInclude
) as CommentVoteInclude[];
