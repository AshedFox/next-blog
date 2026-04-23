import { articleVoteGetManySchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleVoteGetManyDto extends createZodDto(
  articleVoteGetManySchema
) {}
