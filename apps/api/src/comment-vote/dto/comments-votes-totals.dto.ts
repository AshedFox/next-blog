import { commentsVotesTotalsSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentsVotesTotalsDto extends createZodDto(
  commentsVotesTotalsSchema
) {}
