import z from 'zod';

import { ArticleBlockType, ArticleListStyle, VideoProvider } from '../enums';
import { articleSegmentSchema } from './article-segments-schemas';

export const baseArticleBlockSchema = z.object({
  id: z.uuid(),
});

export const articleParagraphBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.PARAGRAPH),
  content: z.array(articleSegmentSchema),
});

export const articleImageBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.IMAGE),
  fileId: z.uuid(),
  url: z.url(),
  alt: z.string().optional(),
});

export const articleVideoBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.VIDEO),
  provider: z.enum(VideoProvider),
  videoId: z.string(),
  embedUrl: z.url(),
});

export const articleCodeBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.CODE),
  content: z.string(),
  language: z.string().optional(),
});

export const articleQuoteBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.QUOTE),
  content: z.array(articleSegmentSchema),
  author: z.string().optional(),
});

export const articleHeadingBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.HEADING),
  content: z.array(articleSegmentSchema),
  level: z.number(),
});

export const articleDividerBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.DIVIDER),
});

export const articleListBlockSchema = baseArticleBlockSchema.extend({
  type: z.literal(ArticleBlockType.LIST),
  style: z.enum(ArticleListStyle),
  items: z.array(articleParagraphBlockSchema),
});

export const articleBlockSchema = z.discriminatedUnion('type', [
  articleParagraphBlockSchema,
  articleImageBlockSchema,
  articleVideoBlockSchema,
  articleCodeBlockSchema,
  articleQuoteBlockSchema,
  articleHeadingBlockSchema,
  articleDividerBlockSchema,
  articleListBlockSchema,
]);
