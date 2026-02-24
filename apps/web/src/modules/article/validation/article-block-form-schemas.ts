import {
  createArticleCodeBlockSchema,
  createArticleDividerBlockSchema,
  createArticleHeadingBlockSchema,
  createArticleImageBlockSchema,
  createArticleListBlockSchema,
  createArticleParagraphBlockSchema,
  createArticleQuoteBlockSchema,
  createArticleVideoBlockSchema,
  VideoProvider,
} from '@workspace/contracts';
import z from 'zod';

import { VIMEO_REGEX, YOUTUBE_REGEX } from '../constants';

export const articleParagraphBlockFormSchema =
  createArticleParagraphBlockSchema;

export const articleImageBlockFormSchema = createArticleImageBlockSchema.extend(
  { url: z.url() }
);

export const articleVideoBlockFormSchema = createArticleVideoBlockSchema
  .extend({ url: z.url() })
  .omit({ videoId: true })
  .refine(
    (data) => {
      if (data.provider === VideoProvider.VIMEO) {
        return VIMEO_REGEX.test(data.url);
      } else if (data.provider === VideoProvider.YOUTUBE) {
        return YOUTUBE_REGEX.test(data.url);
      }
      return false;
    },
    { path: ['url'], error: 'Invalid url format' }
  );

export const articleCodeBlockFormSchema = createArticleCodeBlockSchema;

export const articleQuoteBlockFormSchema = createArticleQuoteBlockSchema;

export const articleHeadingBlockFormSchema = createArticleHeadingBlockSchema;

export const articleDividerBlockFormSchema = createArticleDividerBlockSchema;

export const articleListBlockFormSchema = createArticleListBlockSchema;

export const articleBlockFormSchema = z.discriminatedUnion('type', [
  articleParagraphBlockFormSchema,
  articleImageBlockFormSchema,
  articleVideoBlockFormSchema,
  articleCodeBlockFormSchema,
  articleQuoteBlockFormSchema,
  articleHeadingBlockFormSchema,
  articleDividerBlockFormSchema,
  articleListBlockFormSchema,
]);
