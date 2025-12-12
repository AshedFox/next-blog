import z from 'zod';

import { ArticleSegmentType } from '../enums/article-segment-type';

export const articleTextSegmentSchema = z.object({
  type: z.literal(ArticleSegmentType.TEXT),
  text: z.string(),
  marks: z
    .object({
      bold: z.boolean().optional(),
      italic: z.boolean().optional(),
      underline: z.boolean().optional(),
      code: z.boolean().optional(),
      strike: z.boolean().optional(),
    })
    .optional(),
});

export const articleBreakSegmentSchema = z.object({
  type: z.literal(ArticleSegmentType.BREAK),
});

export const articleSegmentSchema = z.discriminatedUnion('type', [
  articleTextSegmentSchema,
  articleBreakSegmentSchema,
]);
