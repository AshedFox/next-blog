import z from 'zod';

import {
  createArticleCodeBlockSchema,
  createArticleImageBlockSchema,
  createArticleParagraphBlockSchema,
  createArticleQuoteBlockSchema,
  createArticleVideoBlockSchema,
} from '../schemas/create-article-blocks-schemas';

export type CreateParagraphBlockDto = z.infer<
  typeof createArticleParagraphBlockSchema
>;

export type CreateImageBlockDto = z.infer<typeof createArticleImageBlockSchema>;

export type CreateVideoBlockDto = z.infer<typeof createArticleVideoBlockSchema>;

export type CreateCodeBlockDto = z.infer<typeof createArticleCodeBlockSchema>;

export type CreateQuoteBlockDto = z.infer<typeof createArticleQuoteBlockSchema>;

export type CreateArticleBlockDto =
  | CreateParagraphBlockDto
  | CreateImageBlockDto
  | CreateVideoBlockDto
  | CreateCodeBlockDto
  | CreateQuoteBlockDto;
