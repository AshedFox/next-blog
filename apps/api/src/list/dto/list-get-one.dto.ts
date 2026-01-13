import { listGetOneSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListGetOneDto extends createZodDto(listGetOneSchema) {}
