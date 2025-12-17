'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { Code2Icon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const CodeBlockToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('codeBlock'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <Code2Icon />
    </ToolbarButton>
  );
};
