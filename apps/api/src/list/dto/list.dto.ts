import { listSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListDto extends createZodDto(listSchema) {}
