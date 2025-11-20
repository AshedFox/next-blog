import { userSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class UserDto extends createZodDto(userSchema) {}
