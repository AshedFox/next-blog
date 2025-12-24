import z from 'zod';

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000).optional(),
});
