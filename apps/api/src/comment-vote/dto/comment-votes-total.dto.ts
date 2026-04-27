import { commentVotesTotalSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentVotesTotalDto extends createZodDto(
  commentVotesTotalSchema
) {}
