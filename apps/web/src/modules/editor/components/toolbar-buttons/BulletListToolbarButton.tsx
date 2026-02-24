'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { ListIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const BulletListToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('bulletList'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <ListIcon />
    </ToolbarButton>
  );
};
