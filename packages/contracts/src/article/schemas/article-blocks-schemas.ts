import z from 'zod';

import {
  ArticleBlockType,
  CODE_LANGUAGE_VALUES,
  VideoProvider,
} from '../enums';

export const articleParagraphBlockSchema = z.object({
  type: z.literal(ArticleBlockType.PARAGRAPH),
  title: z.string(),
  content: z.string(),
});

export const articleImageBlockSchema = z.object({
  type: z.literal(ArticleBlockType.IMAGE),
  fileId: z.uuid(),
  url: z.url(),
  alt: z.string().optional(),
});

export const articleVideoBlockSchema = z.object({
  type: z.literal(ArticleBlockType.VIDEO),
  provider: z.enum(VideoProvider),
  videoId: z.string(),
  embedUrl: z.url(),
});

export const articleCodeBlockSchema = z.object({
  type: z.literal(ArticleBlockType.CODE),
  content: z.string(),
  language: z.enum(CODE_LANGUAGE_VALUES).optional(),
});

export const articleQuoteBlockSchema = z.object({
  type: z.literal(ArticleBlockType.QUOTE),
  content: z.string(),
  author: z.string().optional(),
});

export const articleBlockSchema = z.discriminatedUnion('type', [
  articleParagraphBlockSchema,
  articleImageBlockSchema,
  articleVideoBlockSchema,
  articleCodeBlockSchema,
  articleQuoteBlockSchema,
]);
