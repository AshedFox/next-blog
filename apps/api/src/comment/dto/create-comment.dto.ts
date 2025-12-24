import { createCommentSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateCommentDto extends createZodDto(createCommentSchema) {}
