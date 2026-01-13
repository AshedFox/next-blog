import { listItemSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListItemDto extends createZodDto(listItemSchema) {}
