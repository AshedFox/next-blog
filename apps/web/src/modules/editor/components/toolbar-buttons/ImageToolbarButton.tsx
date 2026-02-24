'use client';

import { Editor, useEditorState } from '@tiptap/react';
import { FileDto } from '@workspace/contracts';
import { Input } from '@workspace/ui/components/input';
import { ImageIcon } from 'lucide-react';
import React, { useCallback, useRef } from 'react';

import { useFileUpload } from '@/modules/file/hooks';

import ToolbarButton from './ToolbarButton';

type Props = {
  editor: Editor;
};

export const ImageToolbarButton = ({ editor }: Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor.isActive('image'),
  });

  const { handleUpload } = useFileUpload((file: FileDto) => {
    editor
      .chain()
      .focus()
      .setImage({
        src: file.url,
        // @ts-expect-error custom property
        fileId: file.id,
      })
      .run();
  });

  const handleClick = useCallback(() => {
    imageInputRef.current?.click();
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }, []);

  return (
    <>
      <Input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webm"
        hidden
        onChange={handleUpload}
      />
      <ToolbarButton isActive={isActive} onClick={handleClick}>
        <ImageIcon />
      </ToolbarButton>
    </>
  );
};
