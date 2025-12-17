'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { ListOrderedIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const OrderedListToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('orderedList'),
  });

  const handleClick = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <ListOrderedIcon />
    </ToolbarButton>
  );
};
