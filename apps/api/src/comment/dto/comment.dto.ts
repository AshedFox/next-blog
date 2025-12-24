import { commentSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentDto extends createZodDto(commentSchema) {}
