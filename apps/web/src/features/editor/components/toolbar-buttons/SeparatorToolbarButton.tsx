'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { SeparatorHorizontalIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const SeparatorToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('horizontalRule'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <SeparatorHorizontalIcon />
    </ToolbarButton>
  );
};
