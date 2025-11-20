import { articleSearchResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleSearchResponseDto extends createZodDto(
  articleSearchResponseSchema
) {}
