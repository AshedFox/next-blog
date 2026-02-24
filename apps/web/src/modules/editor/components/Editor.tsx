'use client';

import { EditorContent, useEditor } from '@tiptap/react';

import { ArticleBlockFormData } from '@/modules/article/types';
import Spinner from '@/shared/components/Spinner';

import { blocksToTiptap, tiptapToBlocks } from '../lib/editor-adapter';
import { extensions } from '../lib/extensions-config';
import { EditorToolbar } from './EditorToolbar';

type Props = {
  onChange: (blocks: ArticleBlockFormData[]) => void;
  initialBlocks?: ArticleBlockFormData[];
};

export const Editor = ({ initialBlocks, onChange }: Props) => {
  const editor = useEditor(
    {
      immediatelyRender: typeof window !== 'undefined',
      extensions,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm @md:prose-base @lg:prose-lg @xl:prose-xl @2xl:prose-2xl focus:outline-none focus-visible:outline-none dark:prose-invert prose-pre:m-0 prose-code:font-mono p-2 md:p-4 bg-transparent dark:bg-input/30',
        },
      },
      content: initialBlocks ? blocksToTiptap(initialBlocks) : '',
      onUpdate: ({ editor }) => {
        const json = editor.getJSON();
        const blocks = tiptapToBlocks(json);
        onChange?.(blocks);
      },
    },
    [onChange, initialBlocks]
  );

  if (!editor) {
    return (
      <div className="size-full flex items-center justify-center gap-2 animate-pulse">
        <Spinner className="size-6" />
        <span className="font-semibold">Initializing editor...</span>
      </div>
    );
  }

  return (
    <div className="@container size-full border border-input rounded-lg overflow-clip divide-y">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
