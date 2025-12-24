import { commentSearchSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentSearchDto extends createZodDto(commentSearchSchema) {}
