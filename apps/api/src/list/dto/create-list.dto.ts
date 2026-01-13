import { createListSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateListDto extends createZodDto(createListSchema) {}
