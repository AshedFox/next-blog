import { commentVoteGetManySchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentVoteGetManyDto extends createZodDto(
  commentVoteGetManySchema
) {}
