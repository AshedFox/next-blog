import { authResponseSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class AuthResponseDto extends createZodDto(authResponseSchema) {}
