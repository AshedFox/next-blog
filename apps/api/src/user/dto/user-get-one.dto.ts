import { userIncludeSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class UserGetOneDto extends createZodDto(
  z.object({
    include: userIncludeSchema.optional(),
  })
) {}
