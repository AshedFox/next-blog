'use client';

import { type Editor } from '@tiptap/react';
import { Separator } from '@workspace/ui/components/separator';
import { memo } from 'react';

import {
  BoldToolbarButton,
  BulletListToolbarButton,
  CodeBlockToolbarButton,
  CodeToolbarButton,
  HeadingToolbarButton,
  ImageToolbarButton,
  ItalicToolbarButton,
  OrderedListToolbarButton,
  QuoteToolbarButton,
  RedoToolbarButton,
  SeparatorToolbarButton,
  StrikeToolbarButton,
  UnderlineToolbarButton,
  UndoToolbarButton,
  YoutubeToolbarButton,
} from './toolbar-buttons';

type Props = {
  editor: Editor;
};

export const EditorToolbar = memo(({ editor }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-1 bg-card p-1 sticky top-0 z-10">
      <UndoToolbarButton editor={editor} />
      <RedoToolbarButton editor={editor} />

      <Separator orientation="vertical" className=" h-4!" />

      <BoldToolbarButton editor={editor} />
      <ItalicToolbarButton editor={editor} />
      <StrikeToolbarButton editor={editor} />
      <UnderlineToolbarButton editor={editor} />
      <CodeToolbarButton editor={editor} />

      <Separator orientation="vertical" className=" h-4!" />

      <HeadingToolbarButton editor={editor} level={2} />
      <HeadingToolbarButton editor={editor} level={3} />
      <HeadingToolbarButton editor={editor} level={4} />

      <Separator orientation="vertical" className=" h-4!" />

      <BulletListToolbarButton editor={editor} />
      <OrderedListToolbarButton editor={editor} />

      <Separator orientation="vertical" className=" h-4!" />

      <QuoteToolbarButton editor={editor} />
      <CodeBlockToolbarButton editor={editor} />
      <ImageToolbarButton editor={editor} />
      <YoutubeToolbarButton editor={editor} />

      <Separator orientation="vertical" className=" h-4!" />

      <SeparatorToolbarButton editor={editor} />
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';
