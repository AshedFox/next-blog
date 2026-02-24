'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { StrikethroughIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const StrikeToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('strike'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <StrikethroughIcon />
    </ToolbarButton>
  );
};
