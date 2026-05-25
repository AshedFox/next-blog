import { baseTagSchema } from '@workspace/contracts';
import z from 'zod';

export const dbBaseTagSchema = baseTagSchema.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
