import { baseTagSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class TagDto extends createZodDto(baseTagSchema) {}
