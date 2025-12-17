import {
  ArticleBlockType,
  CreateArticleDto,
  VideoProvider,
} from '@workspace/contracts';

import { VIMEO_REGEX, YOUTUBE_REGEX } from './constants';
import { ArticleFormData } from './types';

export function mapFormValuesToContract(
  values: ArticleFormData
): CreateArticleDto {
  return {
    title: values.title,
    blocks: values.blocks.map((block) => {
      switch (block.type) {
        case ArticleBlockType.PARAGRAPH:
        case ArticleBlockType.CODE:
        case ArticleBlockType.QUOTE:
        case ArticleBlockType.HEADING:
        case ArticleBlockType.DIVIDER:
        case ArticleBlockType.LIST:
          return block;
        case ArticleBlockType.IMAGE: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { url: _url, ...rest } = block;
          return rest;
        }
        case ArticleBlockType.VIDEO: {
          const { url, ...rest } = block;
          return {
            ...rest,
            videoId: url.match(
              rest.provider === VideoProvider.YOUTUBE
                ? YOUTUBE_REGEX
                : VIMEO_REGEX
            )![1]!,
          };
        }
      }
    }),
  };
}

export function parseVideoUrl(url: string): {
  provider: (typeof VideoProvider)[keyof typeof VideoProvider] | null;
  videoId: string | null;
} {
  const youtubeMatch = url.match(YOUTUBE_REGEX);
  if (youtubeMatch && youtubeMatch[1]) {
    return { provider: VideoProvider.YOUTUBE, videoId: youtubeMatch[1] };
  }

  const vimeoMatch = url.match(VIMEO_REGEX);

  if (vimeoMatch && vimeoMatch[1]) {
    return { provider: VideoProvider.VIMEO, videoId: vimeoMatch[1] };
  }

  return { provider: null, videoId: null };
}
