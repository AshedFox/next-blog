import z from 'zod';

import { datetimeOutSchema, paginationSchema } from '../common';

export const baseTagSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
});

export const tagSearchSchema = paginationSchema.pick({ limit: true }).extend({
  query: z.string().optional(),
});
