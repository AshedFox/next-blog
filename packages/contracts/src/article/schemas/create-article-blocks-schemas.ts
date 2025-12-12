import z from 'zod';

import {
  CODE_CONTENT_MAX_LENGTH,
  HEADING_CONTENT_MAX_LENGTH,
  MAX_LIST_ITEMS,
  MAX_SEGMENTS_PER_BLOCK,
  PARAGRAPH_CONTENT_MAX_LENGTH,
  QUOTE_CONTENT_MAX_LENGTH,
} from '../constants';
import { ArticleSegmentType } from '../enums/article-segment-type';
import { ArticleSegment } from '../types/article-segments';
import {
  articleCodeBlockSchema,
  articleDividerBlockSchema,
  articleHeadingBlockSchema,
  articleImageBlockSchema,
  articleListBlockSchema,
  articleParagraphBlockSchema,
  articleQuoteBlockSchema,
  articleVideoBlockSchema,
} from './article-blocks-schemas';
import { articleSegmentSchema } from './article-segments-schemas';

function checkContentLength(value: ArticleSegment[], maxLength: number) {
  return (
    value.reduce((totalLength, segment) => {
      if (segment.type === ArticleSegmentType.TEXT) {
        totalLength += segment.text.length;
      }
      return totalLength;
    }, 0) <= maxLength
  );
}

export const createArticleParagraphBlockSchema =
  articleParagraphBlockSchema.extend({
    content: z
      .array(articleSegmentSchema)
      .max(MAX_SEGMENTS_PER_BLOCK)
      .refine((value) => {
        return checkContentLength(value, PARAGRAPH_CONTENT_MAX_LENGTH);
      }),
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
  content: z
    .array(articleSegmentSchema)
    .max(MAX_SEGMENTS_PER_BLOCK)
    .refine((value) => {
      return checkContentLength(value, QUOTE_CONTENT_MAX_LENGTH);
    }),
  author: z.string().min(1).max(100).optional(),
});

export const createArticleHeadingBlockSchema = articleHeadingBlockSchema.extend(
  {
    content: z
      .array(articleSegmentSchema)
      .max(MAX_SEGMENTS_PER_BLOCK)
      .refine((value) => {
        return checkContentLength(value, HEADING_CONTENT_MAX_LENGTH);
      }),
    level: z.number().min(2).max(4),
  }
);

export const createArticleDividerBlockSchema = articleDividerBlockSchema;

export const createArticleListBlockSchema = articleListBlockSchema.extend({
  items: z.array(createArticleParagraphBlockSchema).max(MAX_LIST_ITEMS),
});

export const createArticleBlockSchema = z.discriminatedUnion('type', [
  createArticleParagraphBlockSchema,
  createArticleImageBlockSchema,
  createArticleVideoBlockSchema,
  createArticleCodeBlockSchema,
  createArticleQuoteBlockSchema,
  createArticleHeadingBlockSchema,
  createArticleDividerBlockSchema,
  createArticleListBlockSchema,
]);
