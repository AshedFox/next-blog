'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { BoldIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const BoldToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('bold'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <BoldIcon />
    </ToolbarButton>
  );
};
