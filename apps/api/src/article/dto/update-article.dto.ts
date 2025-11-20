import { updateArticleSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class UpdateArticleDto extends createZodDto(updateArticleSchema) {}
