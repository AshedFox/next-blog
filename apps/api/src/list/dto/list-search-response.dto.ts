import { listSearchResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListSearchResponseDto extends createZodDto(
  listSearchResponseSchema
) {}
