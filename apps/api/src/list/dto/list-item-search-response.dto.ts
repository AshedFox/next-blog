import { listItemSearchResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListItemSearchResponseDto extends createZodDto(
  listItemSearchResponseSchema
) {}
