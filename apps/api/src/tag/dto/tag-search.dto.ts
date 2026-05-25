import { tagSearchSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class TagSearchDto extends createZodDto(tagSearchSchema) {}
