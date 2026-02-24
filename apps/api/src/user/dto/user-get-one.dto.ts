import { userGetOneSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class UserGetOneDto extends createZodDto(userGetOneSchema) {}
