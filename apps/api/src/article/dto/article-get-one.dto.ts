import { articleIncludeSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class ArticleGetOneDto extends createZodDto(
  z.object({ include: articleIncludeSchema.optional() })
) {}
