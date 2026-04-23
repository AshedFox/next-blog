import { articleVotesTotalSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleVotesTotalDto extends createZodDto(
  articleVotesTotalSchema
) {}
