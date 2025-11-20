import { initUploadSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class InitUploadDto extends createZodDto(initUploadSchema) {}
