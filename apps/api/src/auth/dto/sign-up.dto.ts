import { signUpSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class SignUpDto extends createZodDto(signUpSchema) {}
