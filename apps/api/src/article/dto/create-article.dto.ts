import { createArticleSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateArticleDto extends createZodDto(createArticleSchema) {}
