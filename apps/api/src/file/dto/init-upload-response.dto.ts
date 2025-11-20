import { initUploadResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class InitUploadResponseDto extends createZodDto(
  initUploadResponseSchema
) {}
