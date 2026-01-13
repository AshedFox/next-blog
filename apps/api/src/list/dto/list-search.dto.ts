import { listSearchSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListSearchDto extends createZodDto(listSearchSchema) {}
