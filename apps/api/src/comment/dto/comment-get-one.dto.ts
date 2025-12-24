import { commentIncludeSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class CommentGetOneDto extends createZodDto(
  z.object({ include: commentIncludeSchema.optional() })
) {}
