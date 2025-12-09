import z from 'zod';

import {
  CODE_CONTENT_MAX_LENGTH,
  HEADING_CONTENT_MAX_LENGTH,
  PARAGRAPH_CONTENT_MAX_LENGTH,
} from '../constants';
import {
  articleCodeBlockSchema,
  articleHeadingBlockSchema,
  articleImageBlockSchema,
  articleParagraphBlockSchema,
  articleQuoteBlockSchema,
  articleVideoBlockSchema,
} from './article-blocks-schemas';

export const createArticleParagraphBlockSchema =
  articleParagraphBlockSchema.extend({
    content: z.string().min(2).max(PARAGRAPH_CONTENT_MAX_LENGTH),
  });

export const createArticleImageBlockSchema = articleImageBlockSchema
  .extend({
    alt: z.string().min(1).max(100).optional(),
  })
  .omit({
    url: true,
  });

export const createArticleVideoBlockSchema = articleVideoBlockSchema
  .extend({
    videoId: z.string().min(1),
  })
  .omit({
    embedUrl: true,
  });

export const createArticleCodeBlockSchema = articleCodeBlockSchema.extend({
  content: z.string().min(2).max(CODE_CONTENT_MAX_LENGTH),
});

export const createArticleQuoteBlockSchema = articleQuoteBlockSchema.extend({
  content: z.string().min(2).max(CODE_CONTENT_MAX_LENGTH),
  author: z.string().min(1).max(100).optional(),
});

export const createArticleHeadingBlockSchema = articleHeadingBlockSchema.extend(
  {
    content: z.string().min(1).max(HEADING_CONTENT_MAX_LENGTH),
    level: z.number().min(2).max(4),
  }
);

export const createArticleBlockSchema = z.discriminatedUnion('type', [
  createArticleParagraphBlockSchema,
  createArticleImageBlockSchema,
  createArticleVideoBlockSchema,
  createArticleCodeBlockSchema,
  createArticleQuoteBlockSchema,
  createArticleHeadingBlockSchema,
]);
