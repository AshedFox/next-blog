import z from 'zod';

import {
  articleCodeBlockSchema,
  articleImageBlockSchema,
  articleParagraphBlockSchema,
  articleQuoteBlockSchema,
  articleVideoBlockSchema,
} from './article-blocks-schemas';

export const createArticleParagraphBlockSchema = articleParagraphBlockSchema;

export const createArticleImageBlockSchema = articleImageBlockSchema.omit({
  url: true,
});

export const createArticleVideoBlockSchema = articleVideoBlockSchema.omit({
  embedUrl: true,
});

export const createArticleCodeBlockSchema = articleCodeBlockSchema;

export const createArticleQuoteBlockSchema = articleQuoteBlockSchema;

export const createArticleBlockSchema = z.discriminatedUnion('type', [
  createArticleParagraphBlockSchema,
  createArticleImageBlockSchema,
  createArticleVideoBlockSchema,
  createArticleCodeBlockSchema,
  createArticleQuoteBlockSchema,
]);
