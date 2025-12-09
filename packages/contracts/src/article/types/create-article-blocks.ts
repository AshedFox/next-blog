import z from 'zod';

import {
  createArticleBlockSchema,
  createArticleCodeBlockSchema,
  createArticleDividerBlockSchema,
  createArticleHeadingBlockSchema,
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

export type CreateHeadingBlockDto = z.infer<
  typeof createArticleHeadingBlockSchema
>;

export type CreateDividerBlockDto = z.infer<
  typeof createArticleDividerBlockSchema
>;
export type CreateArticleBlockDto = z.infer<typeof createArticleBlockSchema>;
