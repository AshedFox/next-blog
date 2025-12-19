import Image from '@tiptap/extension-image';
import ListItem from '@tiptap/extension-list-item';
import { UniqueID } from '@tiptap/extension-unique-id';
import Youtube from '@tiptap/extension-youtube';
import { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { CustomCodeBlock } from '../components/CustomCodeBlock';
import { CustomQuote } from '../components/CustomQuote';

export const extensions: Extensions = [
  StarterKit.configure({
    codeBlock: false,
    blockquote: false,
    heading: { levels: [2, 3, 4] },
    listItem: false,
  }),
  ListItem.extend({ content: 'paragraph' }),
  CustomCodeBlock,
  CustomQuote,
  Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        fileId: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-file-id'),
          renderHTML: (attributes) => {
            if (!attributes.fileId) {
              return {};
            }
            return { 'data-file-id': attributes.fileId };
          },
        },
      };
    },
  }).configure({
    HTMLAttributes: { class: 'rounded-lg max-h-[80dvh]' },
  }),
  Youtube.configure({
    HTMLAttributes: { class: 'w-full aspect-video rounded-lg' },
  }),
  UniqueID.configure({
    attributeName: 'id',
    types: [
      'heading',
      'paragraph',
      'image',
      'youtube',
      'codeBlock',
      'quote',
      'bulletList',
      'orderedList',
      'listItem',
      'horizontalRule',
    ],
  }),
];
