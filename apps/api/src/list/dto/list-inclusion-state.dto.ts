import { listInclusionStateSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ListInclusionState extends createZodDto(
  listInclusionStateSchema
) {}
