'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { UnderlineIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const UnderlineToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('underline'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <UnderlineIcon />
    </ToolbarButton>
  );
};
