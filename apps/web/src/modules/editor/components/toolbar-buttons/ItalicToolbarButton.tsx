'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { ItalicIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const ItalicToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('italic'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <ItalicIcon />
    </ToolbarButton>
  );
};
