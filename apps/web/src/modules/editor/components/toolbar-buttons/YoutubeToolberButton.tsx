'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { VideoIcon } from 'lucide-react';
import React, { useCallback } from 'react';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const YoutubeToolbarButton = ({ editor }: Props) => {
  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('youtube'),
  });

  const handleClick = useCallback(() => {
    const url = window.prompt('Enter YouTube video URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  return (
    <ToolbarButton isActive={isActive} onClick={handleClick}>
      <VideoIcon />
    </ToolbarButton>
  );
};
