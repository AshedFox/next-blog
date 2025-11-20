import z from 'zod';

import {
  articleImageBlockSchema,
  articleParagraphBlockSchema,
  articleQuoteBlockSchema,
  articleVideoBlockSchema,
} from '../schemas/article-blocks-schemas';

export type ParagraphBlockDto = z.infer<typeof articleParagraphBlockSchema>;

export type ImageBlockDto = z.infer<typeof articleImageBlockSchema>;

export type VideoBlockDto = z.infer<typeof articleVideoBlockSchema>;

export type CodeBlockDto = z.infer<typeof articleVideoBlockSchema>;

export type QuoteBlockDto = z.infer<typeof articleQuoteBlockSchema>;

export type ArticleBlockDto =
  | ParagraphBlockDto
  | ImageBlockDto
  | VideoBlockDto
  | CodeBlockDto
  | QuoteBlockDto;
