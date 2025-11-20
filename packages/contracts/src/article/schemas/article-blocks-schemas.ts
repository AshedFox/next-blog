import z from 'zod';

import {
  CODE_CONTENT_MAX_LENGTH,
  PARAGRAPH_CONTENT_MAX_LENGTH,
  QUOTE_CONTENT_MAX_LENGTH,
} from '../constants';
import {
  ArticleBlockType,
  CODE_LANGUAGE_VALUES,
  VideoProvider,
} from '../enums';

export const articleParagraphBlockSchema = z.object({
  type: z.literal(ArticleBlockType.PARAGRAPH),
  title: z.string().min(2).max(120),
  content: z.string().min(2).max(PARAGRAPH_CONTENT_MAX_LENGTH),
});

export const articleImageBlockSchema = z.object({
  type: z.literal(ArticleBlockType.IMAGE),
  fileId: z.uuid(),
  url: z.url(),
  alt: z.string().min(1).max(100).optional(),
});

export const articleVideoBlockSchema = z.object({
  type: z.literal(ArticleBlockType.VIDEO),
  provider: z.enum(VideoProvider),
  videoId: z.string().min(1),
  embedUrl: z.url(),
});

export const articleCodeBlockSchema = z.object({
  type: z.literal(ArticleBlockType.CODE),
  content: z.string().min(2).max(CODE_CONTENT_MAX_LENGTH),
  language: z.enum(CODE_LANGUAGE_VALUES).optional(),
});

export const articleQuoteBlockSchema = z.object({
  type: z.literal(ArticleBlockType.QUOTE),
  content: z.string().min(2).max(QUOTE_CONTENT_MAX_LENGTH),
  author: z.string().min(1).max(100).optional(),
});

export const articleBlockSchema = z.discriminatedUnion('type', [
  articleParagraphBlockSchema,
  articleImageBlockSchema,
  articleVideoBlockSchema,
  articleCodeBlockSchema,
  articleQuoteBlockSchema,
]);
