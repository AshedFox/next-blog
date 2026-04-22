import { articleModerationGetManyResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleModerationGetManyResponseDto extends createZodDto(
  articleModerationGetManyResponseSchema
) {}
