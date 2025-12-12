import z from 'zod';

import {
  articleBreakSegmentSchema,
  articleSegmentSchema,
  articleTextSegmentSchema,
} from '../schemas/article-segments-schemas';

export type ArticleTextSegment = z.infer<typeof articleTextSegmentSchema>;

export type ArticleBreakSegment = z.infer<typeof articleBreakSegmentSchema>;

export type ArticleSegment = z.infer<typeof articleSegmentSchema>;
