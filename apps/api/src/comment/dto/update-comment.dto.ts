import { updateCommentSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class UpdateCommentDto extends createZodDto(updateCommentSchema) {}
