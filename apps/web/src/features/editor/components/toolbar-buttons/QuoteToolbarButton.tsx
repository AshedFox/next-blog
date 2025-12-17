'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { QuoteIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const QuoteToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('quote'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleNode('quote', 'paragraph').run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <QuoteIcon />
    </ToolbarButton>
  );
};
