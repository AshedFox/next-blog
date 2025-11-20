import { articleSearchSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleSearchDto extends createZodDto(articleSearchSchema) {}
