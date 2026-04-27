import { commentsVotesTotalsArgsSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentsVotesTotalsArgsDto extends createZodDto(
  commentsVotesTotalsArgsSchema
) {}
