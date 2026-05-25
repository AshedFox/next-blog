import { baseCommentSchema } from '@workspace/contracts';
import z from 'zod';

export const dbBaseCommentSchema = baseCommentSchema.extend({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),
});
