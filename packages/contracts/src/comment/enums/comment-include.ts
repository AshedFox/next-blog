export const CommentInclude = {
  author: 'author',
  article: 'article',
  replies: 'replies',
  replyTo: 'replyTo',
} as const;

export type CommentInclude =
  (typeof CommentInclude)[keyof typeof CommentInclude];

export function isCommentInclude(value: string): value is CommentInclude {
  return COMMENT_INCLUDE_VALUES.includes(value as CommentInclude);
}

export const COMMENT_INCLUDE_KEYS = Object.keys(CommentInclude) as Array<
  keyof typeof CommentInclude
>;

export const COMMENT_INCLUDE_VALUES = Object.values(
  CommentInclude
) as CommentInclude[];
