import {
  ArticleBlockDto,
  ArticleBlockType,
  VideoProvider,
} from '@workspace/contracts';

import { Prisma } from '@/prisma/generated/client';

export function enrichArticleBlocks(
  blocks: Prisma.JsonArray,
  getPublicUrl: (fileId: string) => string
): ArticleBlockDto[] {
  return blocks.map((value) => {
    const block = value as ArticleBlockDto;

    if (block.type === ArticleBlockType.IMAGE) {
      block.url = getPublicUrl(block.fileId);
    } else if (block.type === ArticleBlockType.VIDEO) {
      if (block.provider === VideoProvider.YOUTUBE) {
        block.embedUrl = `https://www.youtube.com/embed/${block.videoId}`;
      } else if (block.provider === VideoProvider.VIMEO) {
        block.embedUrl = `https://player.vimeo.com/video/${block.videoId}`;
      }
    }

    return block;
  });
}
