import { commentVoteGetManyResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentVoteGetManyResponseDto extends createZodDto(
  commentVoteGetManyResponseSchema
) {}
