import { listItemSearchSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListItemSearchDto extends createZodDto(listItemSearchSchema) {}
