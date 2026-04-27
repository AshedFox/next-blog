import z from 'zod';

import { CommentVoteInclude } from './enums';
import {
  baseCommentVoteSchema,
  commentsVotesTotalsArgsSchema,
  commentsVotesTotalsSchema,
  commentVoteGetManyResponseSchema,
  commentVoteGetManySchema,
  commentVoteSchema,
  commentVotesTotalSchema,
  createCommentVoteWithRelationsSchema,
} from './schemas';

export type BaseCommentVoteDto = z.infer<typeof baseCommentVoteSchema>;
export type CommentVoteDto = z.infer<typeof commentVoteSchema>;
export type CommentVotesTotalDto = z.infer<typeof commentVotesTotalSchema>;
export type CommentsVotesTotalsArgsDto = z.infer<
  typeof commentsVotesTotalsArgsSchema
>;
export type CommentsVotesTotalsDto = z.infer<typeof commentsVotesTotalsSchema>;
export type CommentVoteWithRelationsDto<
  T extends readonly CommentVoteInclude[],
> = z.infer<ReturnType<typeof createCommentVoteWithRelationsSchema<T>>>;
export type CommentVoteGetManyDto = z.infer<typeof commentVoteGetManySchema>;
export type CommentVoteGetManyResponseDto = z.infer<
  typeof commentVoteGetManyResponseSchema
>;
