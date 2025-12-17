'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { CodeIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const CodeToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('code'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <CodeIcon />
    </ToolbarButton>
  );
};
