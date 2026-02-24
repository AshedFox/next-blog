'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { UndoIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const UndoToolbarButton = ({ editor }: Props) => {
  const canUndo = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.can().undo(),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().undo().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={false} disabled={!canUndo} onClick={handleClick}>
      <UndoIcon />
    </ToolbarButton>
  );
};
