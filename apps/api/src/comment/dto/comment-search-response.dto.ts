import { commentSearchResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentSearchResponseDto extends createZodDto(
  commentSearchResponseSchema
) {}
