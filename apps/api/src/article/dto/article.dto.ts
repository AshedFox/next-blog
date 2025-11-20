import { articleSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleDto extends createZodDto(articleSchema) {}
