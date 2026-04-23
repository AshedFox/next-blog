import { articleVoteGetManyResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleVoteGetManyResponseDto extends createZodDto(
  articleVoteGetManyResponseSchema
) {}
