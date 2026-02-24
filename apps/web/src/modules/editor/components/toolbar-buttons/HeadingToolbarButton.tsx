'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { Heading2Icon, Heading3Icon, Heading4Icon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
  level: 2 | 3 | 4;
};

export const HeadingToolbarButton = ({ editor, level }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('heading', { level }),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleHeading({ level }).run();
  }, [editor, level]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      {level === 2 ? (
        <Heading2Icon />
      ) : level === 3 ? (
        <Heading3Icon />
      ) : (
        <Heading4Icon />
      )}
    </ToolbarButton>
  );
};
