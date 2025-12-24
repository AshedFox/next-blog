import z from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  articleId: z.uuid(),
  replyToId: z.uuid().nullish(),
});
