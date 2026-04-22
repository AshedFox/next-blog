import { articleModerationGetManySchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleModerationGetManyDto extends createZodDto(
  articleModerationGetManySchema
) {}
