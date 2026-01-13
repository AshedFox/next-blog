import { updateListSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class UpdateListDto extends createZodDto(updateListSchema) {}
