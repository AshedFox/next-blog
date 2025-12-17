import { JSONContent } from '@tiptap/react';
import {
  ArticleBlockType,
  ArticleListStyle,
  ArticleSegment,
  ArticleSegmentType,
  ArticleTextSegment,
} from '@workspace/contracts';

import { ArticleBlockFormData } from '@/features/article/types';
import { parseVideoUrl } from '@/features/article/utils';

export function blockContentToTiptap(content: ArticleSegment[]): JSONContent[] {
  return content.map((segment) => {
    if (segment.type === ArticleSegmentType.TEXT) {
      const marks: { type: string }[] = [];

      if (segment.marks?.bold) {
        marks.push({ type: 'bold' });
      }
      if (segment.marks?.italic) {
        marks.push({ type: 'italic' });
      }
      if (segment.marks?.underline) {
        marks.push({ type: 'underline' });
      }
      if (segment.marks?.code) {
        marks.push({ type: 'code' });
      }
      if (segment.marks?.strike) {
        marks.push({ type: 'strike' });
      }

      return { type: 'text', text: segment.text, marks };
    }
    return { type: 'hardBreak' };
  });
}

export function blocksToTiptap(blocks: ArticleBlockFormData[]): JSONContent {
  const content: JSONContent[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case ArticleBlockType.HEADING: {
        content.push({
          type: 'heading',
          attrs: { level: block.level, id: block.id },
          content: blockContentToTiptap(block.content),
        });
        break;
      }

      case ArticleBlockType.PARAGRAPH: {
        content.push({
          attrs: { id: block.id },
          type: 'paragraph',
          content: blockContentToTiptap(block.content),
        });
        break;
      }

      case ArticleBlockType.IMAGE:
        content.push({
          type: 'image',
          attrs: {
            id: block.id,
            src: block.url,
            alt: block.alt,
            fileId: block.fileId,
          },
        });
        break;

      case ArticleBlockType.VIDEO: {
        content.push({
          type: 'youtube',
          attrs: { src: block.url, id: block.id },
        });
        break;
      }

      case ArticleBlockType.CODE:
        content.push({
          type: 'codeBlock',
          content: [{ type: 'text', text: block.content }],
          attrs: {
            id: block.id,
            language: block.language,
          },
        });
        break;

      case ArticleBlockType.QUOTE:
        content.push({
          type: 'quote',
          attrs: { id: block.id, author: block.author },
          content: blockContentToTiptap(block.content),
        });
        break;

      case ArticleBlockType.LIST:
        content.push({
          attrs: { id: block.id },
          type:
            block.style === ArticleListStyle.ORDERED
              ? 'orderedList'
              : 'bulletList',
          content: block.items.map((item) => ({
            type: 'listItem',
            content: [
              {
                attrs: { id: item.id },
                type: 'paragraph',
                content: blockContentToTiptap(item.content),
              },
            ],
          })),
        });
        break;

      case ArticleBlockType.DIVIDER:
        content.push({ attrs: { id: block.id }, type: 'horizontalRule' });
        break;
    }
  }

  return { type: 'doc', content };
}

export function tiptapToBlockContent(content: JSONContent[]): ArticleSegment[] {
  return content.map((node) => {
    if (node.type === 'text') {
      const marks: ArticleTextSegment['marks'] = {};

      for (const mark of node.marks || []) {
        switch (mark.type) {
          case 'bold':
            marks.bold = true;
            break;
          case 'italic':
            marks.italic = true;
            break;
          case 'underline':
            marks.underline = true;
            break;
          case 'code':
            marks.code = true;
            break;
          case 'strike':
            marks.strike = true;
            break;
        }
      }

      return { type: ArticleSegmentType.TEXT, text: node.text || '', marks };
    }

    return { type: ArticleSegmentType.BREAK };
  });
}

export const tiptapToBlocks = (json: JSONContent): ArticleBlockFormData[] => {
  const blocks: ArticleBlockFormData[] = [];

  if (!json.content) {
    return blocks;
  }

  for (const node of json.content) {
    switch (node.type) {
      case 'heading':
        if (node.content?.length) {
          blocks.push({
            id: node.attrs?.id ?? '',
            type: ArticleBlockType.HEADING,
            content: tiptapToBlockContent(node.content),
            level: (node.attrs?.level as number) || 2,
          });
        }
        break;

      case 'paragraph':
        if (node.content?.length) {
          blocks.push({
            id: node.attrs?.id ?? '',
            type: ArticleBlockType.PARAGRAPH,
            content: tiptapToBlockContent(node.content),
          });
        }
        break;

      case 'image':
        if (node.attrs?.fileId) {
          blocks.push({
            id: node.attrs?.id ?? '',
            type: ArticleBlockType.IMAGE,
            fileId: node.attrs.fileId,
            url: node.attrs.src,
            alt: node.attrs.alt || undefined,
          });
        }
        break;

      case 'youtube': {
        const src = node.attrs?.src as string | undefined;
        if (src) {
          const { provider, videoId } = parseVideoUrl(src);
          if (provider && videoId) {
            blocks.push({
              id: node.attrs?.id ?? '',
              type: ArticleBlockType.VIDEO,
              provider,
              url: src,
            });
          }
        }
        break;
      }

      case 'codeBlock':
        blocks.push({
          id: node.attrs?.id ?? '',
          type: ArticleBlockType.CODE,
          content: node.content?.[0]?.text || '',
          language: node.attrs?.language || 'plaintext',
        });
        break;

      case 'quote':
        blocks.push({
          id: node.attrs?.id ?? '',
          type: ArticleBlockType.QUOTE,
          content: tiptapToBlockContent(node.content || []),
          author: node.attrs?.author || undefined,
        });
        break;

      case 'bulletList':
      case 'orderedList':
        if (node.content?.length) {
          blocks.push({
            id: node.attrs?.id ?? '',
            type: ArticleBlockType.LIST,
            style:
              node.type === 'orderedList'
                ? ArticleListStyle.ORDERED
                : ArticleListStyle.BULLET,
            items: node.content.map((item) => ({
              id: item.attrs?.id ?? '',
              type: ArticleBlockType.PARAGRAPH,
              content: tiptapToBlockContent(item.content?.[0]?.content || []),
            })),
          });
        }
        break;

      case 'horizontalRule':
        blocks.push({
          id: node.attrs?.id ?? '',
          type: ArticleBlockType.DIVIDER,
        });
        break;
    }
  }

  return blocks;
};
