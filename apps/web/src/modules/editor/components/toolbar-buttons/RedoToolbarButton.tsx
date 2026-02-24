'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { RedoIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const RedoToolbarButton = ({ editor }: Props) => {
  const canRedo = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.can().redo(),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().redo().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={false} disabled={!canRedo} onClick={handleClick}>
      <RedoIcon />
    </ToolbarButton>
  );
};
