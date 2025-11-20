import { fileSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class FileDto extends createZodDto(fileSchema) {}
