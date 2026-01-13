import { listItemGetOneSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListItemGetOneDto extends createZodDto(listItemGetOneSchema) {}
